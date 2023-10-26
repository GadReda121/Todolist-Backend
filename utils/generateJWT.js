const jwt = require('jsonwebtoken');

const generateJWT = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30d'});
    return token;
}

module.exports = generateJWT;