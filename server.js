const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const username = 's-orbital';
let githubData = {
  bio: '',
  avatar_url: ''
};

// Retry-enabled fetch function
async function fetchGitHubData(retryCount = 0) {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    });

    githubData.bio = res.data.bio || 'No bio set.';
    githubData.avatar_url = res.data.avatar_url || '';
    console.log('✅ Fetched GitHub data:', githubData);
  } catch (err) {
    console.error(`❌ Fetch error (attempt ${retryCount + 1}):`, err.response?.data || err.message);

    if (retryCount < 2) {
      setTimeout(() => fetchGitHubData(retryCount + 1), 1000); // retry after 1s
    } else {
      console.error('❌ Max retries reached.');
    }
  }
}

// Initial fetch + polling every 60s
fetchGitHubData();
setInterval(() => fetchGitHubData(), 60000);

// API Routes
app.get('/bio', (req, res) => res.json(githubData));
app.get('/health', (req, res) => res.send('OK'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
