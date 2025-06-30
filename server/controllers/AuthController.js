const User = require('../models/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY_USER } = process.env;

class AuthController {
    static register = async (req, res) => {
        try {
            const { username, email, password, repeatPassword } = req.body;

            if (password !== repeatPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            const userByUsername = await User.findOne({ username });
            if (userByUsername) {
                return res.status(409).json({ message: 'Username already taken.' });
            }

            const userByEmail = await User.findOne({ email });
            if (userByEmail) {
                return res.status(409).json({ message: 'Email already exists in the system.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            await newUser.save();
            return res.status(201).json({ message: 'User registered successfully.' });

        } catch (error) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyValue)[0];
                let errorMessage = `Duplicate field: ${field}. Value '${error.keyValue[field]}' already exists.`;

                if (field === 'username') {
                    errorMessage = 'Username already taken.';
                } else if (field === 'email') {
                    errorMessage = 'Email already exists in the system.';
                }
                return res.status(409).json({ message: errorMessage });
            }

            return res.status(500).json({ message: 'Server error during registration: ' + error.message });
        }
    };

    static login = async (req, res) => {
        const { email, password } = req.body;

        let user = null;

        user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const secretKey = JWT_SECRET_KEY_USER;
        if (!secretKey) {
            return res.status(500).json({ message: 'Server configuration error: JWT secret key missing.' });
        }

        const token = jwt.sign(
            { id: user._id },
            secretKey,
            { expiresIn: '1d' }
        );

        res.json({ user, token });
    };
}

module.exports = AuthController;