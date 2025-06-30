import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/ProductList.css';
import { useLocation, Link } from 'react-router-dom';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const location = useLocation();

    const [newProductFormData, setNewProductFormData] = useState({
        name: '',
        brand: '',
        category: '',
        description: '',
        price: '',
        countInStock: '',
        image: null,
    });

    const fetchProducts = async (keyword = '', category = '') => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:4000/products`, {
                params: { keyword, category }
            });
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products.');
            toast.error(err.response?.data?.message || 'Failed to fetch products.');
            setLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const keyword = queryParams.get('keyword') || '';
        const category = queryParams.get('category') || '';
        fetchProducts(keyword, category);
    }, [location.search]);

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        setNewProductFormData({ ...newProductFormData, [name]: value });
    };

    const handleNewProductImageChange = (e) => {
        setNewProductFormData({ ...newProductFormData, image: e.target.files[0] });
    };

    const handleNewProductSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in newProductFormData) {
            data.append(key, newProductFormData[key]);
        }

        try {
            const response = await axios.post(`http://localhost:4000/products`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(response.data.message);
            setShowAddProductForm(false);
            setNewProductFormData({
                name: '',
                brand: '',
                category: '',
                description: '',
                price: '',
                countInStock: '',
                image: null,
            });
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error(error.response?.data?.message || 'Failed to add product.');
        }
    };

    const handleAddToCartClick = (product) => {
        if (addToCart) {
            addToCart(product, 1);
        } else {
            console.error('addToCart function is not passed to ProductList');
            toast.error('Add to cart function not available.');
        }
    };

    if (loading) {
        return <div className="product-list-loading">Loading products...</div>;
    }

    if (error) {
        return <div className="product-list-error">{error}</div>;
    }

    return (
        <div className="product-list-wrapper">
            <h1 className="product-list-page-title">Featured Products</h1>

            <button
                onClick={() => setShowAddProductForm(!showAddProductForm)}
                className="add-product-toggle-button"
            >
                {showAddProductForm ? '↩️' : 'Add New Product'}
            </button>

            {showAddProductForm && (
                <div className="add-product-form-container">
                    <h2 className="add-product-form-title">Add New Product</h2>
                    <form onSubmit={handleNewProductSubmit} className="add-product-form">
                        <div className="form-group">
                            <label htmlFor="name">Product Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newProductFormData.name}
                                onChange={handleNewProductChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="brand">Brand:</label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={newProductFormData.brand}
                                onChange={handleNewProductChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category:</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={newProductFormData.category}
                                onChange={handleNewProductChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={newProductFormData.description}
                                onChange={handleNewProductChange}
                                className="form-textarea"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price:</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={newProductFormData.price}
                                onChange={handleNewProductChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="countInStock">Count In Stock:</label>
                            <input
                                type="number"
                                id="countInStock"
                                name="countInStock"
                                value={newProductFormData.countInStock}
                                onChange={handleNewProductChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Product Image:</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleNewProductImageChange}
                                className="form-input-file"
                                accept="image/*"
                                required
                            />
                        </div>
                        <div className="form-buttons-group">
                            <button
                                type="submit"
                                className="add-product-submit-button"
                            >
                                Add Product
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddProductForm(false)}
                                className="add-product-cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="product-grid">
                {products.length === 0 ? (
                    <p className="no-products-message">No products found. Add some!</p>
                ) : (
                    products.map((product) => (
                        <div key={product._id} className="product-card">
                            <Link to={`/products/${product._id}`} className="product-card-link">
                                <img
                                    src={`http://localhost:4000${product.image}`}
                                    alt={product.name}
                                    className="product-card__image"
                                />
                                <h2 className="product-card__name">{product.name}</h2>
                                <div className="product-card__rating">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <span key={i} className={i < product.rating ? "star filled" : "star"}>★</span>
                                    ))}
                                    <span className="product-card__reviews-count">({product.numReviews || 0} reviews)</span>
                                </div>
                                <p className="product-card__price">${product.price}</p>
                            </Link>

                            {product.countInStock > 0 ? (
                                <button
                                    className="product-card__add-to-cart-button"
                                    onClick={() => handleAddToCartClick(product)}
                                >
                                    Add to cart
                                </button>
                            ) : (
                                <p className="product-card__stock-status product-card__stock-status--out-of-stock">Out of stock</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList;