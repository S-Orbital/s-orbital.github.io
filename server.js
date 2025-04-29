// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

let githubBio = '';

const username = 'S-Orbital'; // replace with your GitHub username

const fetchBio = async () => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}`);
    githubBio = res.data.bio || 'Nothing here.';
  } catch (err) {
    console.error('Failed to fetch GitHub bio');
  }
};

setInterval(fetchBio, 60000); // every minute
fetchBio(); // initial fetch

app.get('/bio', (req, res) => {
  res.send(githubBio);
});

app.listen(3000, () => console.log('Server running on port 3000'));
