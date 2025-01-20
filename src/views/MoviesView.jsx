import React, { useState, useEffect } from "react";
import { useStoreContext } from "../context"; // Access context to display selected genres
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./MoviesView.css";

// List of all available genres
const ALL_GENRES = [
  { name: "Action", id: 28 },
  { name: "Comedy", id: 35 },
  { name: "Drama", id: 18 },
  { name: "Horror", id: 27 },
  { name: "Sci-Fi", id: 878 },
  { name: "Animation", id: 16 },
  { name: "Adventure", id: 12 },
  { name: "Crime", id: 80 },
  { name: "Documentary", id: 99 },
  { name: "Fantasy", id: 14 },
  { name: "Mystery", id: 9648 },
  { name: "Romance", id: 10749 },
  { name: "Thriller", id: 53 },
  { name: "War", id: 10752 },
  { name: "Western", id: 37 },
];

const MoviesView = () => {
  const { user } = useStoreContext(); // Access user from context
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  // Load user-selected genres
  useEffect(() => {
    if (user?.genres) {
      setSelectedGenres(user.genres);
    }
  }, [user]);

  const handleGenreClick = (genreId) => {
    navigate(`/movies/genre/${genreId}`);
  };

  return (
    <div className="movies-view">
      <Header />
      <div className="main-content">
        <div className="genres-sidebar">
          <h3>Your Selected Genres</h3>
          {selectedGenres.length > 0 ? (
            <ul>
              {selectedGenres.map((genreName) => {
                const genre = ALL_GENRES.find((g) => g.name === genreName);
                return (
                  genre && (
                    <li key={genre.id} onClick={() => handleGenreClick(genre.id)}>
                      {genre.name}
                    </li>
                  )
                );
              })}
            </ul>
          ) : (
            <p>No genres selected.</p>
          )}
        </div>
        <div className="dynamic-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MoviesView;