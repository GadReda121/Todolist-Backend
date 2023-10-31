const express = require('express');
const { register, login, getAllUsers, getProfile, updateUser, deleteUser, signOut } = require('../controller/user-controller');
const allowedTo = require('../middleware/allowedTo');
const { ADMIN } = require('../utils/user_status');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.route('/')
        .get(verifyToken, allowedTo(ADMIN), getAllUsers);

router.route('/profile')
        .get(verifyToken, getProfile)
        .delete(verifyToken, deleteUser)

router.route('/register')
        .post(register);

router.route('/login')
        .post(login);

router.route('/signOut')
        .get(verifyToken, signOut);
        
router.route('/updateUser')
        .put(verifyToken, updateUser)
        
module.exports = router;