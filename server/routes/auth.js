const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const {validRegister} = require("../middlewares/ValidRegister");

router.post('/register', validRegister, AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;