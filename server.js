const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

let githubBio = '';
const username = 's-orbital'; // 👈 your GitHub username

const fetchBio = async () => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}` // 👈 uses token from env var
      }
    });
    githubBio = res.data.bio || 'No bio set.';
    console.log("Fetched bio:", githubBio);
  } catch (err) {
    console.error('Error fetching GitHub bio:', err.response?.data || err.message);
  }
};

setInterval(fetchBio, 60000); // every minute
fetchBio(); // initial call

app.get('/bio', (req, res) => {
  res.send(githubBio);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.listen(3000, () => console.log('Server running on port 3000'));
