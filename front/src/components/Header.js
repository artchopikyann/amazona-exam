import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/Header.css';

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            navigate(`/search?keyword=${searchKeyword.trim()}`);
        } else {
            navigate('/');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/signin');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-left">
                    <button className="sidebar-toggle-button" onClick={toggleSidebar}>
                        {toggleSidebar ? null:
                            <ul className="sidebar-menu">
                            <li><a href="/search?category=Pants">Pants</a></li>
                            <li><a href="/search?category=Shirts">Shirts</a></li>
                            <li><a href="/search?category=sample category">sample category</a></li>
                        </ul>
                        }
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <Link to="/" className="header-brand">
                        amazona
                    </Link>
                </div>
                <form className="header-search" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </form>
                <nav className="header-nav">
                    <Link to="/cart" className="cart-link">
                        <FontAwesomeIcon icon={faShoppingCart} />
                        <span>Cart</span>
                    </Link>
                    {isLoggedIn ? (
                        <Link to="#" onClick={handleSignOut}>Sign Out</Link>
                    ) : (
                        <Link to="/signin">Sign In</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;