async function updateBio() {
  try {
    const res = await fetch('https://s-orbital-github-io.onrender.com/bio');
    const data = await res.json();

    document.getElementById('avatar').src = data.avatar_url || '';
    document.getElementById('bio').innerText = data.bio || '';
    document.getElementById('status').innerHTML = data.status?.emoji
      ? emojione.shortnameToImage(`${data.status.emoji} ${data.status.message || ''}`)
      : '';
  } catch (err) {
    console.error('Fetch failed:', err);
    document.getElementById('bio').innerText = '';
    document.getElementById('status').innerText = '';
  }
}




async function loadReadme() {
  const res = await fetch('https://raw.githubusercontent.com/S-Orbital/S-Orbital/main/README.md');
  const md = await res.text();
  document.getElementById('readme').innerHTML = marked.parse(md);
}

updateBio();
setInterval(updateBio, 60000);
loadReadme();
