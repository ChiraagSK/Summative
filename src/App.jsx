import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/privateRoute';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import MoviesView from './views/MoviesView';
import GenreView from './views/GenreView';
import DetailView from './views/DetailView';
import CartView from './views/CartView';
import SettingsView from './views/SettingsView';
import { StoreProvider } from './context';
import "./App.css";

const App = () => (
<StoreProvider>
  <Router>
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/movies" element={<PrivateRoute><MoviesView /></PrivateRoute>}>
        <Route path="genre/:genre_id" element={<GenreView />} />
        <Route path="details/:id" element={<DetailView />} />
      </Route>
        <Route path="/cart" element={<PrivateRoute><CartView /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsView /></PrivateRoute>} />
    </Routes>
  </Router>
</StoreProvider>
);

export default App;