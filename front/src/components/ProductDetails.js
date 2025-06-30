import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/ProductDetails.css';

const ProductDetails = ({ addToCart }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4000/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Product not found or server error');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCartClick = () => {
        if (product && addToCart) {
            addToCart(product, quantity);
        }
    };

    if (loading) {
        return <div>Loading product details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div>Product not found.</div>;
    }

    return (
        <div className="product-details-container">
            <div className="product-image-section">
                <img src={`http://localhost:4000${product.image}`} alt={product.name} className="product-detail-image" />
            </div>
            <div className="product-info-section">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-brand">{product.brand}</p>
                <div className="product-price">${product.price}</div>
                <div className="product-description">{product.description}</div>
                <div className="product-stock-status">
                    Status: {product.countInStock > 0 ? <span className="in-stock">In Stock</span> : <span className="out-of-stock">Out of Stock</span>}
                </div>
                {product.countInStock > 0 && (
                    <div className="product-quantity-selector">
                        <label htmlFor="quantity">Qty:</label>
                        <select
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="quantity-selector"
                        >
                            {[...Array(product.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <button
                    onClick={handleAddToCartClick}
                    className="add-to-cart-button"
                    disabled={product.countInStock === 0}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;