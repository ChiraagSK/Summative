import React from 'react';
import { Link } from 'react-router-dom';
import "./Genres.css";

const Genres = ({ genres }) => (
  <ul className="genres-list">
    {genres.map((genre) => (
      <li key={genre.id} className="genre-item">
        <Link to={`/movies/genre/${genre.id}`} className="genre-link">
          {genre.name}
        </Link>
      </li>
    ))}
  </ul>
);

export default Genres;