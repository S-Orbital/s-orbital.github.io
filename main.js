async function updateBio() {
  try {
    const res = await fetch('https://s-orbital-github-io.onrender.com/bio');
    const data = await res.json();

    document.getElementById('bio').innerText = data.bio || '';
    document.getElementById('avatar').src = data.avatar_url || '';
    document.getElementById('gitname').innerText = data.name || '';

    if (data.status && (data.status.message || data.status.emoji)) {
      const rawStatus = `${data.status.emoji || ''} ${data.status.message || ''}`;
      document.getElementById('status').innerHTML = emojione.shortnameToImage(rawStatus);
    } else {
      document.getElementById('status').innerText = '';
    }
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
