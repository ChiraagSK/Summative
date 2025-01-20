import React, { useState, useEffect } from "react";
import { useStoreContext } from "../context"; // Access context to update user and genre preferences
import { getAuth, updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { firestore } from "../firebase"; // Access Firestore
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; // Firestore methods for updating and checking data

// Complete list of all available genres
const ALL_GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Animation",
  "Adventure",
  "Crime",
  "Documentary",
  "Fantasy",
  "Mystery",
  "Romance",
  "Thriller",
  "War",
  "Western",
];

const SettingsView = () => {
  const { user, setUser, previousPurchases, setPreviousPurchases } = useStoreContext(); // Access user and previous purchases
  const auth = getAuth();
  const [newFirstName, setNewFirstName] = useState(user?.firstName || "");
  const [newLastName, setNewLastName] = useState(user?.lastName || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [newGenres, setNewGenres] = useState(user?.genres || []); // Store selected genres
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.uid) { 
          const userRef = doc(firestore, "users", user.uid); 
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPreviousPurchases(userData.previousPurchases || []); 
          } else {
            console.log("No user data found!");
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [user?.uid, setPreviousPurchases]); 

  const handleUpdateProfile = async () => {
    try {
      const userCredential = auth.currentUser;

      
      const userRef = doc(firestore, "users", userCredential.uid);
      const userDoc = await getDoc(userRef);

      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          genres: newGenres,
          previousPurchases: [],
        });
        console.log("User document created!");
      }

      
      await updateProfile(userCredential, {
        displayName: `${newFirstName} ${newLastName}`,
      });

      
      if (newEmail !== user.email) {
        await updateEmail(userCredential, newEmail);
      }

      
      if (newPassword) {
        await updatePassword(userCredential, newPassword);
      }

      
      await updateDoc(userRef, {
        genres: newGenres,
      });

      
      setUser({
        ...user,
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        genres: newGenres,
      });

      setSuccessMessage("Profile updated successfully!");
      navigate('/movies');
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.code === "permission-denied") {
        setError("You do not have permission to update this data.");
      } else {
        setError("An error occurred while updating your profile. Please try again.");
      }
    }
  };

  
  const handleGenreChange = (event) => {
    const { value, checked } = event.target;
    setNewGenres((prevGenres) =>
      checked ? [...prevGenres, value] : prevGenres.filter((genre) => genre !== value)
    );
  };

  
  const pastPurchasesList = previousPurchases.map((purchase, index) => (
    <li key={index}>
      <img
        src={purchase.posterImage}
        alt={purchase.title}
        style={{ width: "50px", height: "75px", marginRight: "10px" }}
      />
      {purchase.title}
    </li>
  ));

  
  if (!user.email) {
    return <p>Please log in with your email to update your settings.</p>;
  }

  return (
    <div className="settings-view">
      <h2>Settings</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

    
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />
      </div>

      
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
        />
      </div>

    
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
      </div>

    
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      
      <h3>Select Your Preferred Genres:</h3>
      <div>
        {ALL_GENRES.map((genre) => (
          <div key={genre}>
            <input
              type="checkbox"
              value={genre}
              checked={newGenres.includes(genre)} 
              onChange={handleGenreChange}
            />
            <label>{genre}</label>
          </div>
        ))}
      </div>

      <button onClick={handleUpdateProfile}>Update Profile</button>

      <h3>Past Purchases:</h3>
      {pastPurchasesList.length > 0 ? (
        <ul>{pastPurchasesList}</ul>
      ) : (
        <p>No previous purchases found.</p>
      )}
    </div>
  );
};

export default SettingsView;
