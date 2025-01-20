import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './RegisterView.css';

const ALL_GENRES = [
  { name: "Action", id: 28 },
  { name: "Comedy", id: 35 },
  { name: "Animation", id: 16 },
  { name: "Adventure", id: 12 },
  { name: "Crime", id: 80 },
  { name: "Documentary", id: 99 },
  { name: "Drama", id: 18 },
  { name: "Family", id: 10751 },
  { name: "Fantasy", id: 14 },
  { name: "History", id: 36 },
  { name: "Horror", id: 27 },
  { name: "Music", id: 10402 },
  { name: "Mystery", id: 9648 },
  { name: "Romance", id: 10749 },
  { name: "Sci-Fi", id: 878 },
  { name: "TV-Movie", id: 10770 },
  { name: "Thriller", id: 53 },
  { name: "War", id: 10752 },
  { name: "Western", id: 37 },
];

const RegisterView = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const { setUser } = useStoreContext();
  const navigate = useNavigate();

  const handleRegisterWithEmail = async () => {
    if (selectedGenres.length < 3) {
      alert('Please select at least 3 genres.');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Save user info to Firestore
      const userRef = doc(firestore, 'users', firebaseUser.uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        email,
        genres: selectedGenres, // Store genres in Firestore
        previousPurchases: [], // Initialize previous purchases
      });

      // Save user info in React Context
      setUser({
        uid: firebaseUser.uid,
        firstName,
        lastName,
        email,
        genres: selectedGenres,
      });

      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      console.error('Error registering user:', err);
      alert('Registration failed. Please try again.');
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      const [googleFirstName, googleLastName = ''] = firebaseUser.displayName?.split(' ') || [''];

      // Save user info to Firestore
      const userRef = doc(firestore, 'users', firebaseUser.uid);
      await setDoc(userRef, {
        firstName: googleFirstName,
        lastName: googleLastName,
        email: firebaseUser.email,
        genres: selectedGenres, // Store genres in Firestore
        previousPurchases: [], // Initialize previous purchases
      });

      // Save user info in React Context
      setUser({
        uid: firebaseUser.uid,
        firstName: googleFirstName,
        lastName: googleLastName,
        email: firebaseUser.email,
        genres: selectedGenres,
      });

      alert('Registration successful with Google!');
      navigate('/login');
    } catch (err) {
      console.error('Error with Google registration:', err);
      alert('Google registration failed. Please try again.');
    }
  };

  return (
    <div className="register-view">
      <h2>Register</h2>
      <form>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <h3>Select Genres:</h3>
          {ALL_GENRES.map((genre) => (
            <div key={genre.id}>
              <input
                type="checkbox"
                value={genre.name}
                onChange={(e) => {
                  const { checked, value } = e.target;
                  setSelectedGenres((prev) =>
                    checked ? [...prev, value] : prev.filter((g) => g !== value)
                  );
                }}
              />
              <label>{genre.name}</label>
            </div>
          ))}
        </div>
        <button type="button" onClick={handleRegisterWithEmail}>
          Register with Email
        </button>
        <button type="button" onClick={handleRegisterWithGoogle}>
          Register with Google
        </button>
      </form>
    </div>
  );
};

export default RegisterView;
