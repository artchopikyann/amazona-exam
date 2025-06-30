const Joi = require('joi');

const validRegister = (req, res, next) => {
    try {
        const Schema = Joi.object({
            username: Joi.string().min(3).max(100).pattern(/^[a-zA-Z\s]+$/).required().messages({
                'string.pattern.base': 'First and last name must contain only letters'
            }),

            email: Joi.string().email().min(6).max(100).required(),

            phoneNumber: Joi.string().pattern(/^\d+$/).length(9).min(9).max(11).optional(),

            password: Joi.string().min(8).max(100).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#])[A-Za-z\d@$#]{8,}$/).required().messages({
                'string.pattern.base': 'The password must contain at least one uppercase letter, lowercase letter, number, and one of the special characters (@, $, #)'
            }),

            role: Joi.string().valid('user', 'admin').optional(),

            repeatPassword: Joi.string().valid(Joi.ref('password')).required().messages({
                'any.only': 'Passwords do not match.'
            }),
        });

        const { error } = Schema.validate(req.body);

        if (error) return res.status(400).json({ error: error.message });

        next();
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};


module.exports = { validRegister };
