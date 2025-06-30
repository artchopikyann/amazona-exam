const User = require('../models/UserSchema');
const Product = require('../models/ProductSchema');

const getUserCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.productId');
        if (user) {
            res.json(user.cart);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Could not fetch cart.' });
    }
};

const addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const user = await User.findById(req.user._id);
        const product = await Product.findById(productId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        if (product.countInStock === 0) {
            return res.status(400).json({ message: 'Product is out of stock.' });
        }

        const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            const currentQuantity = user.cart[itemIndex].quantity;
            const newQuantity = currentQuantity + quantity;

            if (newQuantity > product.countInStock) {
                return res.status(400).json({ message: `Only ${product.countInStock} of ${product.name} available in stock.` });
            }
            user.cart[itemIndex].quantity = newQuantity;
        } else {
            if (quantity > product.countInStock) {
                return res.status(400).json({ message: `Only ${product.countInStock} of ${product.name} available in stock.` });
            }
            user.cart.push({ productId, quantity });
        }

        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('cart.productId');
        res.json(updatedUser.cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Could not add item to cart.' });
    }
};

const updateCartItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        const user = await User.findById(req.user._id);
        const product = await Product.findById(productId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                user.cart.splice(itemIndex, 1);
            } else if (quantity > product.countInStock) {
                return res.status(400).json({ message: `Only ${product.countInStock} of ${product.name} available in stock.` });
            } else {
                user.cart[itemIndex].quantity = quantity;
            }
            await user.save();
            const updatedUser = await User.findById(req.user._id).populate('cart.productId');
            res.json(updatedUser.cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Could not update cart item quantity.' });
    }
};

const removeCartItem = async (req, res) => {
    const { productId } = req.params;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const initialLength = user.cart.length;
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        if (user.cart.length === initialLength) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }

        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('cart.productId');
        res.json(updatedUser.cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Could not remove item from cart.' });
    }
};

module.exports = {
    getUserCart,
    addItemToCart,
    updateCartItemQuantity,
    removeCartItem,
};