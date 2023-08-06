const API_KEY = "3e42e757";
const APILINK = `http://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}`;
const SEARCHAPI = `http://www.omdbapi.com/?apikey=${API_KEY}&s=`;

const main = document.getElementById("section");
const form = document.getElementById("form");
const query = document.getElementById("query");

// Function to create a card for a movie
function createCard(movie) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${movie.Poster}" alt="${movie.Title}">
    <div class="card-content">
      <h3>${movie.Title}</h3>
      <button>Watch Now</button>
    </div>
  `;

  return card;
}

// Function to fetch and display movies as cards
async function displayMovies(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    main.innerHTML = ""; // Clear previous results

    if (data.Response === "True" && Array.isArray(data.Search)) {
      data.Search.forEach((movie) => {
        if (movie.Poster && movie.Poster !== "N/A") {
          main.appendChild(createCard(movie));
        }
      });
    } else {
      main.innerHTML = `<p>No movies found or there was an error.</p>`;
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    main.innerHTML = `<p>Error fetching movie details. Please try again later.</p>`;
  }
}

// Display trending movies when the page loads
displayMovies(APILINK + "&s=Multiverse");

// Event listener for instant movie search
query.addEventListener("input", (e) => {
  const searchItem = e.target.value.trim();
  displayMovies(searchItem ? SEARCHAPI + encodeURIComponent(searchItem) : APILINK + "&s=Multiverse");
});
