const express = require('express');
const { register, login, getAllUsers, getProfile } = require('../controller/user-controller');
const allowedTo = require('../middleware/allowedTo');
const { ADMIN } = require('../utils/user_status');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.route('/')
        .get(verifyToken, allowedTo(ADMIN), getAllUsers);

router.route('/profile')
        .get(verifyToken, getProfile);

router.route('/register')
        .post(register);

router.route('/login')
        .post(login)
        
module.exports = router;