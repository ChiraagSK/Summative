import React, { createContext, useState, useContext, useEffect } from 'react';
import { Map } from 'immutable';
import { firestore } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { uid: '', email: '', firstName: '', lastName: '', genres: [] };
  });

  const [cart, setCart] = useState(new Map());
  const [previousPurchases, setPreviousPurchases] = useState(() => {
    const savedPurchases = localStorage.getItem('previousPurchases');
    return savedPurchases ? JSON.parse(savedPurchases) : [];
  });

  // localStorage (reload issue fix)
  const setUser = (newUser) => {
    setUserState(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  
  useEffect(() => {
    localStorage.setItem('previousPurchases', JSON.stringify(previousPurchases));
  }, [previousPurchases]);


  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPreviousPurchases(userData.previousPurchases || []);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    };

    fetchUserData();
  }, [user?.uid]);

  
  const logout = () => {
    setUser(null);
    setCart(new Map());
    setPreviousPurchases([]);
    localStorage.clear();
  };

  const addToCart = (movie) => {
    setCart((prevCart) => {
      if (prevCart.has(movie.id)) {
        return prevCart.delete(movie.id);
      } else {
        return prevCart.set(movie.id, movie);
      }
    });
    localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        cart,
        setCart,
        previousPurchases,
        setPreviousPurchases,
        logout,
        addToCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
