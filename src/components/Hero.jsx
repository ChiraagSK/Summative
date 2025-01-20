import React from 'react';
import './Hero.css';

const Hero = () => (
  <section className="hero">
    <div className="hero-overlay">
      <div className="hero-content">
        <h1>Welcome to Cineflix!</h1>
        <p>Discover your next favorite movie. Browse by genre, explore popular titles, and much more!</p>
        <button className="hero-button">Explore Now</button>
      </div>
    </div>
  </section>
);

export default Hero;
