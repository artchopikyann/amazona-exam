const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/AuthMiddleware');
const {
  getUserCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
} = require('../controllers/cartController');

router.get('/cart', protect, getUserCart);
router.post('/cart/add', protect, addItemToCart);
router.put('/cart/update/:productId', protect, updateCartItemQuantity);
router.delete('/cart/remove/:productId', protect, removeCartItem);

module.exports = router;