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

const fetchGitHubData = async () => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    });
    githubData.bio = res.data.bio || 'No bio set.';
    githubData.avatar_url = res.data.avatar_url || '';
    console.log('Fetched GitHub data:', githubData);
  } catch (err) {
    console.error('Error fetching GitHub data:', err.response?.data || err.message);
  }
};

setInterval(fetchGitHubData, 60000);
fetchGitHubData();

app.get('/bio', (req, res) => {
  res.json(githubData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
