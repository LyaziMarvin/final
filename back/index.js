const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const axios = require('axios');
const neo4j = require('neo4j-driver');
const OpenAI = require('openai');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://final-1-yoe4.onrender.com',
  credentials: true,
}));

app.use(express.json());

const SECRET_KEY = '1234'; // Replace with secure value in production

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const driver = neo4j.driver(
  'neo4j://184.168.29.119:7687',
  neo4j.auth.basic('neo4j', 'ooglobeneo4j')
);

// 🔸 Fetch user metadata
async function getUserMetadata(userID) {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:Person {userID: $userID})
       RETURN u.culturalBackground AS culturalBackground, u.language AS language`,
      { userID }
    );
    if (result.records.length === 0) throw new Error('User not found');
    return result.records[0].toObject();
  } finally {
    await session.close();
  }
}

// 1️⃣ Generate Story
app.post('/api/generate-story', async (req, res) => {
  const { message, userID } = req.body;
  try {
    const { culturalBackground, language } = await getUserMetadata(userID);
    const prompt = `Write a heartwarming short story based on the following personal reflection, considering a ${culturalBackground} background and in ${language}:\n\n"${message}"`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const story = completion.choices[0].message.content.trim();
    res.json({ story });
  } catch (err) {
    console.error('Story generation error:', err.message);
    res.status(500).json({ error: 'Story generation failed' });
  }
});

// 2️⃣ Narrate Story (TTS)
app.post('/api/speak-story', async (req, res) => {
  const { story, userID } = req.body;

  try {
    const { language } = await getUserMetadata(userID);
    const selectedLanguage = language ? language.toLowerCase() : 'english';

    const speechResponse = await openai.audio.speech.create({
      model: 'tts-1',
      input: story,
      voice: selectedLanguage.includes('english') ? 'nova' : 'shimmer',
      response_format: 'mp3',
    });

    const audioBuffer = await speechResponse.arrayBuffer();
    res.set({ 'Content-Type': 'audio/mpeg' });
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

// 3️⃣ Generate Image
app.post('/api/generate-image', async (req, res) => {
  const { memory, userID } = req.body;
  try {
    const translation = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Translate the following memory description to English:' },
        { role: 'user', content: memory },
      ],
    });

    const englishPrompt = translation.choices[0].message.content;

    const detailedPrompt = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Rewrite the following description as a vivid visual scene for image generation:' },
        { role: 'user', content: englishPrompt },
      ],
    });

    const visualPrompt = detailedPrompt.choices[0].message.content;

    const imageResponse = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt: visualPrompt,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const imageUrl = imageResponse.data.data?.[0]?.url;
    if (!imageUrl) throw new Error('No image URL returned');

    res.json({ imageUrl });
  } catch (err) {
    console.error('Image generation failed:', err);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// 4️⃣ Translate helper
async function translateToEnglish(message, userLanguage) {
  if (!message || userLanguage.toLowerCase() === 'english') {
    return message;
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Translate the following message to English from ${userLanguage}. Only return the translated message.`,
      },
      { role: 'user', content: message },
    ],
  });

  return response.choices[0].message.content.trim();
}

// 5️⃣ Generate Playlist
app.post('/api/generate-playlist', async (req, res) => {
  const { message, userID } = req.body;

  if (!message || !userID) {
    return res.status(400).json({ error: "Missing 'message' or 'userID'" });
  }

  try {
    const { culturalBackground, language } = await getUserMetadata(userID);
    const translatedMessage = await translateToEnglish(message, language);

    const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        q: translatedMessage,
        part: 'snippet',
        type: 'video',
        maxResults: 5,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const playlists = ytRes.data.items.map((item) => ({
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    res.json({ playlists });
  } catch (err) {
    console.error('Playlist generation failed:', err);
    res.status(500).json({ error: 'Playlist generation failed', details: err.message });
  }
});

// 🔐 Register
app.post('/register', async (req, res) => {
  const { email, age, culturalBackground, language, gender, country } = req.body;

  if (!email || !age || !culturalBackground || !language || !gender || !country) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const session = driver.session();
  try {
    await session.run(
      `CREATE (u:Person {
        userID: randomUUID(),
        email: $email,
        age: $age,
        culturalBackground: $culturalBackground,
        language: $language,
        gender: $gender,
        country: $country
      })`,
      { email, age: Number(age), culturalBackground, language, gender, country }
    );
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
});

// 🔐 Login
app.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:Person {email: $email}) RETURN u.userID AS userID`,
      { email }
    );

    if (result.records.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const userID = result.records[0].get('userID');
    const token = jwt.sign({ userID }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, userID });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
  console.log(`Agent backend running on port ${PORT}`);
});
