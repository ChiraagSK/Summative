import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Feature.css";

const Feature = () => {
  const [movies, setMovies] = useState([]);
  
  
  const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w300";

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=411dd9da619b939a28f09f83b812595b&language=en-US&page=1')
      .then(response => setMovies(response.data.results.slice(0, 3)))
      .catch(error => console.error(error));
  }, []);

  return (
    <section>
      <h2>Featured Movies</h2>
      <div className="feature-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`${BASE_IMAGE_URL}${movie.poster_path}`}
              alt={`${movie.title} Poster`}
            />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feature;

