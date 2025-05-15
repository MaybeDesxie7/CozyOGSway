function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('show');
}
// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
});
// Live Search Filtering for Tracks
document.getElementById("searchInput").addEventListener("input", function () {
  const filter = this.value.toLowerCase();
  const trackCards = document.querySelectorAll(".track-card");

  trackCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(filter) ? "block" : "none";
  });
});

// Optional: Add glowing effect to playing audio
const audios = document.querySelectorAll("audio");

audios.forEach((audio) => {
  audio.addEventListener("play", () => {
    audios.forEach((a) => {
      if (a !== audio) a.pause();
    });
    audio.parentElement.classList.add("playing");
  });

  audio.addEventListener("pause", () => {
    audio.parentElement.classList.remove("playing");
  });
});
// Fetch and render tracks from tracks.json
async function loadTracks() {
  const res = await fetch('tracks.json');
  const data = await res.json();
  renderTracks(data);

  // Search input
  document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const filtered = data.filter(track =>
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      track.genre.toLowerCase().includes(query)
    );
    renderTracks(filtered);
  });
}

// Render track cards
/*function renderTracks(tracks) {
  const container = document.getElementById("trackList");
  container.innerHTML = "";

  if (tracks.length === 0) {
    container.innerHTML = "<p>No tracks found.</p>";
    return;
  }

  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "track-card";
    card.innerHTML = `
      <h3>${track.title}</h3>
      <p><strong>Artist:</strong> ${track.artist}</p>
      <p><strong>Genre:</strong> ${track.genre}</p>
      <audio controls>
        <source src="${track.src}" type="audio/mpeg" />
      </audio>
    `;
    container.appendChild(card);
  });
}

loadTracks();
let allTracks = [];

async function loadTracks() {
  const res = await fetch('tracks.json');
  allTracks = await res.json();

  populateGenres(allTracks);
  populateArtists(allTracks);
  renderTracks(allTracks);

  document.getElementById("searchInput").addEventListener("input", applyFilters);
  document.getElementById("artistFilter").addEventListener("change", applyFilters);
  document.getElementById("sortSelect").addEventListener("change", applyFilters);
}

function populateGenres(tracks) {
  const genres = [...new Set(tracks.map(track => track.genre))];
  const container = document.getElementById("genreFilters");
  container.innerHTML = "";

  genres.forEach(genre => {
    const btn = document.createElement("button");
    btn.textContent = genre;
    btn.onclick = () => {
      document.querySelectorAll("#genreFilters button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    };
    container.appendChild(btn);
  });
}

function populateArtists(tracks) {
  const artists = [...new Set(tracks.map(track => track.artist))];
  const select = document.getElementById("artistFilter");
  artists.forEach(artist => {
    const option = document.createElement("option");
    option.value = artist;
    option.textContent = artist;
    select.appendChild(option);
  });
}

function applyFilters() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();
  const activeGenre = document.querySelector("#genreFilters .active")?.textContent || "";
  const artistFilter = document.getElementById("artistFilter").value;
  const sortOption = document.getElementById("sortSelect").value;

  let filtered = [...allTracks];

  if (searchQuery) {
    filtered = filtered.filter(track =>
      track.title.toLowerCase().includes(searchQuery) ||
      track.artist.toLowerCase().includes(searchQuery) ||
      track.genre.toLowerCase().includes(searchQuery)
    );
  }

  if (activeGenre) {
    filtered = filtered.filter(track => track.genre === activeGenre);
  }

  if (artistFilter) {
    filtered = filtered.filter(track => track.artist === artistFilter);
  }

  if (sortOption === "az") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "za") {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  renderTracks(filtered);
}

function renderTracks(tracks) {
  const container = document.getElementById("trackList");
  container.innerHTML = "";

  if (tracks.length === 0) {
    container.innerHTML = "<p>No tracks found.</p>";
    return;
  }

  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "track-card";
    card.innerHTML = `
      <h3>${track.title}</h3>
      <p><strong>Artist:</strong> ${track.artist}</p>
      <p><strong>Genre:</strong> ${track.genre}</p>
      <audio controls>
        <source src="${track.src}" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    `;
    container.appendChild(card);
  });
}

loadTracks();
function renderTracks(tracks) {
  const container = document.getElementById("trackList");
  container.innerHTML = "";

  if (tracks.length === 0) {
    container.innerHTML = "<p>No tracks found.</p>";
    return;
  }

  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "track-card";

    const likedTracks = JSON.parse(localStorage.getItem("likedTracks") || "[]");
    const savedTracks = JSON.parse(localStorage.getItem("savedTracks") || "[]");

    const isLiked = likedTracks.includes(track.title);
    const isSaved = savedTracks.includes(track.title);

    card.innerHTML = `
      <h3>${track.title}</h3>
      <p><strong>Artist:</strong> ${track.artist}</p>
      <p><strong>Genre:</strong> ${track.genre}</p>
      <audio controls>
        <source src="${track.src}" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div class="track-actions">
        <button class="like-btn ${isLiked ? "liked" : ""}" data-title="${track.title}">
          ❤️ ${isLiked ? "Liked" : "Like"}
        </button>
        <button class="save-btn ${isSaved ? "saved" : ""}" data-title="${track.title}">
          💾 ${isSaved ? "Saved" : "Save"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // Like button click
  document.querySelectorAll(".like-btn").forEach(button => {
    button.addEventListener("click", () => {
      const title = button.getAttribute("data-title");
      let liked = JSON.parse(localStorage.getItem("likedTracks") || "[]");

      if (liked.includes(title)) {
        liked = liked.filter(t => t !== title);
      } else {
        liked.push(title);
      }

      localStorage.setItem("likedTracks", JSON.stringify(liked));
      renderTracks(allTracks); // Re-render to update button state
    });
  });

  // Save button click
  document.querySelectorAll(".save-btn").forEach(button => {
    button.addEventListener("click", () => {
      const title = button.getAttribute("data-title");
      let saved = JSON.parse(localStorage.getItem("savedTracks") || "[]");

      if (saved.includes(title)) {
        saved = saved.filter(t => t !== title);
      } else {
        saved.push(title);
      }

      localStorage.setItem("savedTracks", JSON.stringify(saved));
      renderTracks(allTracks);
    });
  });
}*/
let allTracks = [];

async function loadTracks() {
  const res = await fetch('tracks.json');
  allTracks = await res.json();

  populateGenres(allTracks);
  populateArtists(allTracks);
  renderTracks(allTracks);

  document.getElementById("searchInput").addEventListener("input", applyFilters);
  document.getElementById("artistFilter").addEventListener("change", applyFilters);
  document.getElementById("sortSelect").addEventListener("change", applyFilters);
}

function populateGenres(tracks) {
  const genres = [...new Set(tracks.map(track => track.genre))];
  const container = document.getElementById("genreFilters");
  container.innerHTML = "";

  genres.forEach(genre => {
    const btn = document.createElement("button");
    btn.textContent = genre;
    btn.onclick = () => {
      document.querySelectorAll("#genreFilters button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    };
    container.appendChild(btn);
  });
}

function populateArtists(tracks) {
  const artists = [...new Set(tracks.map(track => track.artist))];
  const select = document.getElementById("artistFilter");
  artists.forEach(artist => {
    const option = document.createElement("option");
    option.value = artist;
    option.textContent = artist;
    select.appendChild(option);
  });
}

function applyFilters() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();
  const activeGenre = document.querySelector("#genreFilters .active")?.textContent || "";
  const artistFilter = document.getElementById("artistFilter").value;
  const sortOption = document.getElementById("sortSelect").value;

  let filtered = [...allTracks];

  if (searchQuery) {
    filtered = filtered.filter(track =>
      track.title.toLowerCase().includes(searchQuery) ||
      track.artist.toLowerCase().includes(searchQuery) ||
      track.genre.toLowerCase().includes(searchQuery)
    );
  }

  if (activeGenre) {
    filtered = filtered.filter(track => track.genre === activeGenre);
  }

  if (artistFilter) {
    filtered = filtered.filter(track => track.artist === artistFilter);
  }

  if (sortOption === "az") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "za") {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  renderTracks(filtered);
}

function renderTracks(tracks) {
  const container = document.getElementById("trackList");
  container.innerHTML = "";

  if (tracks.length === 0) {
    container.innerHTML = "<p>No tracks found.</p>";
    return;
  }

  const likedTracks = JSON.parse(localStorage.getItem("likedTracks") || "[]");
  const savedTracks = JSON.parse(localStorage.getItem("savedTracks") || "[]");

  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "track-card";

    const isLiked = likedTracks.includes(track.title);
    const isSaved = savedTracks.includes(track.title);

    card.innerHTML = `
      <h3>${track.title}</h3>
      <p><strong>Artist:</strong> ${track.artist}</p>
      <p><strong>Genre:</strong> ${track.genre}</p>
      <audio controls>
        <source src="${track.src}" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div class="track-actions">
        <button class="like-btn ${isLiked ? "liked" : ""}" data-title="${track.title}">
          ❤️ ${isLiked ? "Liked" : "Like"}
        </button>
        <button class="save-btn ${isSaved ? "saved" : ""}" data-title="${track.title}">
          💾 ${isSaved ? "Saved" : "Save"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // Like Button Handler
  document.querySelectorAll(".like-btn").forEach(button => {
    button.addEventListener("click", () => {
      const title = button.getAttribute("data-title");
      let liked = JSON.parse(localStorage.getItem("likedTracks") || "[]");

      if (liked.includes(title)) {
        liked = liked.filter(t => t !== title);
      } else {
        liked.push(title);
      }

      localStorage.setItem("likedTracks", JSON.stringify(liked));
      renderTracks(allTracks);
    });
  });

  // Save Button Handler
  document.querySelectorAll(".save-btn").forEach(button => {
    button.addEventListener("click", () => {
      const title = button.getAttribute("data-title");
      let saved = JSON.parse(localStorage.getItem("savedTracks") || "[]");

      if (saved.includes(title)) {
        saved = saved.filter(t => t !== title);
      } else {
        saved.push(title);
      }

      localStorage.setItem("savedTracks", JSON.stringify(saved));
      renderTracks(allTracks);
    });
  });
}

// Load everything
loadTracks();
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("buzzFeed")) {
    fetch("buzz.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to load buzz.json");
        }
        return response.json();
      })
      .then(data => {
        const container = document.getElementById("buzzFeed");

        data.forEach(item => {
          const card = document.createElement("div");
          card.className = "buzz-card";

          card.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.content}</p>
            <span class="buzz-date">${item.date}</span>
          `;

          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Error loading buzz:", error);
        document.getElementById("buzzFeed").innerHTML = "<p style='color:red;'>Failed to load updates.</p>";
      });
  }
});

/*document.addEventListener('DOMContentLoaded', () => {
  const buzzFeed = document.getElementById('buzzFeed');
  if (buzzFeed) {
    fetch('buzz.json')
      .then(res => res.json())
      .then(data => {
        data.forEach(post => {
          const div = document.createElement('div');
          div.classList.add('buzz-post');
          div.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.description}</p>
          `;
          buzzFeed.appendChild(div);
        });
      })
      .catch(err => {
        buzzFeed.innerHTML = '<p style="text-align:center;">Unable to load buzz feed.</p>';
        console.error(err);
      });
  }
});*/
