import React from 'react';
import '../assets/styles/ProductCard.css'


const ProductCard = ({ product }) => {
    const { name, image, price, reviews, status } = product;

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < rating ? 'star filled' : 'star'}>
          &#9733; {/* Unicode for a star character */}
        </span>
            );
        }
        return stars;
    };

    return (
        <div className="product-card">
            <img src={image} alt={name} className="product-card__image" />
            <h3 className="product-card__name">{name}</h3>
            <div className="product-card__rating">
                {renderStars(reviews.rating)}
                <span className="product-card__reviews-count">{reviews.count} reviews</span>
            </div>
            <p className="product-card__price">${price}</p>
            {status === 'Out of stock' ? (
                <p className="product-card__status product-card__status--out-of-stock">
                    Out of stock
                </p>
            ) : (
                <button className="product-card__add-to-cart">Add to cart</button>
            )}
        </div>
    );
};

export default ProductCard;