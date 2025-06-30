import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';
import './assets/styles/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCartItems = async () => {
            if (token) {
                try {
                    const { data } = await axios.get('http://localhost:4000/user/cart', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCartItems(data);
                } catch (error) {
                    console.error('Failed to fetch cart items:', error);
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
        };
        fetchCartItems();
    }, [token]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const addToCartHandler = async (product, quantity = 1) => {
        if (!token) {
            toast.error("Please sign in to add items to cart.");
            return;
        }

        try {
            const { data } = await axios.post('http://localhost:4000/user/cart/add', {
                productId: product._id,
                quantity: quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(data);
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart.');
        }
    };

    return (
        <Router>
            <div className="app-wrapper">
                <Header toggleSidebar={toggleSidebar} cartItemCount={cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)} />
                <div className={`main-content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                    {isSidebarOpen && (
                        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
                    )}
                    <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                        <ul className="sidebar-menu">
                            <li><a href="/search?category=Pants">Pants</a></li>
                            <li><a href="/search?category=Shirts">Shirts</a></li>
                            <li><a href="/search?category=sample category">sample category</a></li>
                        </ul>
                    </div>
                    <main className="main-content">
                        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                        <Routes>
                            <Route path="/" element={<ProductList addToCart={addToCartHandler} />} />
                            <Route path="/search" element={<ProductList addToCart={addToCartHandler} />} />
                            <Route path="/signin" element={<LoginPage />} />
                            <Route path="/signup" element={<RegisterPage />} />
                            <Route
                                path="/cart"
                                element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
                            />
                            <Route
                                path="/products/:id"
                                element={<ProductDetails addToCart={addToCartHandler} />}
                            />
                        </Routes>
                    </main>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;