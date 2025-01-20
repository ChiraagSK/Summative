import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firestore } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import './LoginView.css';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useStoreContext();
  const navigate = useNavigate();

  const handleLoginWithEmail = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
  
      // Fetch user data from Firestore
      const userRef = doc(firestore, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
  
        // Set user data in context, including genres
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          genres: userData.genres || [], // Ensure genres are retrieved
        });
  
        navigate('/movies');
      } else {
        throw new Error("User data not found in Firestore.");
      }
    } catch (err) {
      console.error('Error logging in with email:', err.message);
      setError('Invalid email or password.');
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
  
      // Fetch user data from Firestore
      const userRef = doc(firestore, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
  
        // Set user data in the context
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          genres: userData.genres || [], // Fetch genres from Firestore
        });
  
        navigate('/movies');
      } else {
        throw new Error("User data not found in Firestore.");
      }
    } catch (err) {
      console.error('Error logging in with Google:', err.message);
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="login-view">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLoginWithEmail}>
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
        <button type="submit">Login with Email</button>
      </form>
      <button onClick={handleLoginWithGoogle}>Login with Google</button>
    </div>
  );
};

export default LoginView;