const Product = require('../models/ProductSchema');
const path = require('path');
const fs = require('fs');

const getAllProducts = async (req, res, next) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const products = await Product.find({ ...keyword });

        res.json(products);
    } catch (err) {
        console.error("Error in getAllProducts:", err);
        res.status(500).json({ message: err.message || 'Failed to fetch products.' });
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createProduct = async (req, res, next) => {
    try {
        const { name, brand, category, description, price, countInStock } = req.body;
        let image = '';

        if (req.file) {
            const pathParts = req.file.path.split(path.sep);
            const publicIndex = pathParts.indexOf('public');
            if (publicIndex === -1) {
                return res.status(500).json({ message: 'Public directory not found in file path.' });
            }
            image = '/' + pathParts.slice(publicIndex + 1).join('/');
        } else {
            return res.status(400).json({ message: 'Product image is required.' });
        }

        if (!name || !brand || !category || !description || !price || !countInStock || !image) {
            return res.status(400).json({ message: 'Please enter all required fields.' });
        }

        const product = new Product({
            name,
            brand,
            category,
            description,
            price,
            countInStock,
            image,
            user: req.user?._id
        });

        const createdProduct = await product.save();
        res.status(201).json({
            message: 'Product added successfully!',
            product: createdProduct
        });
    } catch (error) {
        console.error('Error in createProduct:', error);
        res.status(500).json({ message: error.message || 'Failed to add product.' });
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { name, brand, category, description, price, countInStock } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        product.name = name ?? product.name;
        product.brand = brand ?? product.brand;
        product.category = category ?? product.category;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.countInStock = countInStock ?? product.countInStock;

        if (req.file) {
            if (product.image) {
                const oldImagePath = path.join(__dirname, '..', 'public', product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            const pathParts = req.file.path.split(path.sep);
            const publicIndex = pathParts.indexOf('public');
            if (publicIndex === -1) {
                return res.status(500).json({ message: 'Public directory not found in file path for update.' });
            }
            product.image = '/' + pathParts.slice(publicIndex + 1).join('/');
        }

        const updatedProduct = await product.save();
        res.json({
            message: 'Product updated successfully!',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error in updateProduct:', error);
        res.status(500).json({ message: error.message || 'Failed to update product.' });
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        if (product.image) {
            const imagePath = path.join(__dirname, '..', 'public', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.deleteOne();
        res.json({ message: 'Product removed successfully.' });
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        res.status(500).json({ message: error.message || 'Failed to delete product.' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};