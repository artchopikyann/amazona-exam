import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import '../assets/styles/Cart.css';

const Cart = ({ cartItems, setCartItems }) => {
    const token = localStorage.getItem('token');

    const updateQuantity = async (productId, quantity, productName) => {
        if (!token) {
            toast.error("Please sign in to modify cart.");
            return;
        }
        if (quantity < 1) {
            removeFromCart(productId, productName);
            return;
        }
        try {
            const res = await axios.put(`http://localhost:4000/user/cart/update/${productId}`, { quantity }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(res.data);
            toast.success(`Quantity for ${productName} updated!`, { autoClose: 1500 });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update quantity.', { autoClose: 2000 });
        }
    };

    const removeFromCart = async (productId, productName) => {
        if (!token) {
            toast.error("Please sign in to modify cart.");
            return;
        }
        try {
            const res = await axios.delete(`http://localhost:4000/user/cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(res.data);
            toast.info(`${productName} removed from cart.`, { autoClose: 5000 });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove from cart.', { autoClose: 5000 });
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) =>
                total + ((item.productId && item.productId.price !== undefined) ? (item.productId.price * item.quantity) : 0)
            , 0).toFixed(2);
    };

    const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <div className="container cart-page">
            <h1 className="cart-page-title">Shopping Cart</h1>

            <div className="cart-grid">
                <div className="cart-main">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty-box">
                            <p className="cart-empty-text">Cart is empty. <Link to="/">Go Shopping</Link></p>
                            {/* <Lottie
                                animationData={emptyWishlistAnimation}
                                loop={true}
                                autoplay={true}
                                style={{ width: 200, height: 200, margin: '0 auto' }}
                            /> */}
                        </div>
                    ) : (
                        <ul className="cart-items-list">
                            {cartItems.map(item => (
                                item && item.productId ? (
                                    <li key={item.productId._id} className="cart-item">
                                        <Link to={`/products/${item.productId._id}`} className="cart-item-link">
                                            {item.productId.image && (
                                                <img src={`http://localhost:4000${item.productId.image}`} alt={item.productId.name || 'Product Image'} className="cart-item-image" />
                                            )}
                                            <div className="cart-item-details">
                                                <h3>{item.productId.name || 'Unknown Product'}</h3>
                                                <p>Price: ${item.productId.price !== undefined ? item.productId.price.toFixed(2) : 'N/A'}</p>
                                                <div className="quantity-controls">
                                                    <button type="button" onClick={() => updateQuantity(item.productId._id, item.quantity - 1, item.productId.name || 'Unknown Product')} disabled={item.quantity <= 1}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button type="button" onClick={() => updateQuantity(item.productId._id, item.quantity + 1, item.productId.name || 'Unknown Product')}>+</button>
                                                </div>
                                            </div>
                                        </Link>
                                        <button onClick={() => removeFromCart(item.productId._id, item.productId.name || 'Unknown Product')} className="remove-item-button">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </li>
                                ) : null
                            ))}
                        </ul>
                    )}
                </div>
                <div className="cart-summary">
                    <h3 className="cart-summary-title">Subtotal ({totalItemsCount} items): <span className="cart-summary-total">${calculateTotal()}</span></h3>
                    <button className="proceed-to-checkout-button" disabled={cartItems.length === 0}>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;