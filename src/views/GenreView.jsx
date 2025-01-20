import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const GenreView = () => {
  const { genre_id } = useParams();
  const [movies, setMovies] = useState([]);
  const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w300";
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=411dd9da619b939a28f09f83b812595b&with_genres=${genre_id}`
      )
      .then((response) => setMovies(response.data.results))
      .catch((error) => console.error(error));//Try Catch
  }, [genre_id]);

  const handleMovieClick = (id) => {
    navigate(`/movies/details/${id}`);
    console.log(id);
  };

  return (
    <div>
      <h2>Movies in this Genre</h2>
      <div className="feature-grid">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => handleMovieClick(movie.id)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={`${BASE_IMAGE_URL}${movie.poster_path}`}
              alt={`${movie.title} Poster`}
            />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreView;