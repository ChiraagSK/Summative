import React from 'react';
import { useStoreContext } from '../context';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const CartView = () => {
  const { cart, setCart, user, previousPurchases, setPreviousPurchases } = useStoreContext();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      if (!user?.uid) {
        alert('You must be logged in to proceed with checkout.');
        navigate('/login');
        return;
      }

      const userRef = doc(firestore, 'users', user.uid);
      const purchasedMovies = Array.from(cart.values());

      await updateDoc(userRef, {
        previousPurchases: [...previousPurchases, ...purchasedMovies],
      });

      setPreviousPurchases([...previousPurchases, ...purchasedMovies]);
      setCart(new Map());
      localStorage.removeItem('cart');

      alert('Thank you for your purchase!');
      navigate('/');
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  const handleRemove = (id) => {
    setCart((prevCart) => prevCart.delete(id));
  };

  return (
    <div className="cart-view">
      <h2>Your Cart</h2>
      {cart.size > 0 ? (
        <ul>
          {Array.from(cart.values()).map((item) => (
            <li key={item.id}>
              <img
                src={item.posterImage}
                alt={item.title}
                style={{ width: '50px', marginRight: '10px' }}
              />
              {item.title}
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}

      {cart.size > 0 && (
        <button onClick={handleCheckout} style={{ marginTop: '20px' }}>
          Checkout
        </button>
      )}

      <h2>Past Purchases</h2>
      {previousPurchases.length > 0 ? (
        <ul>
          {previousPurchases.map((item, index) => (
            <li key={index}>
              <img
                src={item.posterImage}
                alt={item.title}
                style={{ width: '50px', marginRight: '10px' }}
              />
              {item.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no past purchases.</p>
      )}
    </div>
  );
};

export default CartView;