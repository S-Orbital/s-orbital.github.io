const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const username = 's-orbital';
let githubData = {
  bio: '',
  avatar_url: '',
  status: {
    message: '',
    emoji: ''
  }
};

// Fetch GitHub status via GraphQL
async function fetchGitHubStatus() {
  const query = `
    {
      user(login: "${username}") {
        status {
          message
          emoji
        }
      }
    }
  `;

  try {
    const res = await axios.post(
      'https://api.github.com/graphql',
      { query },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    const status = res.data.data.user.status;
    githubData.status = status || { message: '', emoji: '' };
    console.log('✅ Fetched GitHub status:', githubData.status);
  } catch (err) {
    console.error('❌ Error fetching GitHub status:', err.response?.data || err.message);
  }
}

// Retry-enabled bio/avatar fetch
async function fetchGitHubData(retryCount = 0) {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    });

    githubData.bio = res.data.bio || 'No bio set.';
    githubData.avatar_url = res.data.avatar_url || '';

    await fetchGitHubStatus();

    console.log('✅ Fetched GitHub data:', githubData);
  } catch (err) {
    console.error(`❌ Fetch error (attempt ${retryCount + 1}):`, err.response?.data || err.message);

    if (retryCount < 2) {
      setTimeout(() => fetchGitHubData(retryCount + 1), 1000);
    } else {
      console.error('❌ Max retries reached.');
    }
  }
}

// Initial fetch + repeat every 60s
fetchGitHubData();
setInterval(fetchGitHubData, 60000);

// Routes
app.get('/bio', (req, res) => res.json(githubData));
app.get('/health', (req, res) => res.send('OK'));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
