import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStoreContext } from "../context"; // Import the context to access the user state
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Header.css";

const Header = () => {
  const { user, setUser, setCart, setPreviousPurchases } = useStoreContext(); // Access user and other states from context
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const logout = async () => {
    try {
      
      setUser(null);
      setCart(new Map());
      setPreviousPurchases([]);
      
      
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      localStorage.removeItem("previousPurchases");

      
      await signOut(auth);

      
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <header className="header">
      <h1 className="header-title" onClick={() => navigate("/")}>
        Cineflix
      </h1>
      <nav className="header-nav">
        {user ? (
          <>
            <p className="welcome-text">Hello, {user.firstName}!</p>
            <button
              className={`nav-button ${location.pathname === "/cart" ? "active" : ""}`}
              onClick={() => navigate("/cart")}
            >
              Cart
            </button>
            <button
              className={`nav-button ${location.pathname === "/settings" ? "active" : ""}`}
              onClick={() => navigate("/settings")}
            >
              Settings
            </button>
            <button className="nav-button logout-button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className={`nav-button ${location.pathname === "/login" ? "active" : ""}`}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className={`nav-button ${location.pathname === "/register" ? "active" : ""}`}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
