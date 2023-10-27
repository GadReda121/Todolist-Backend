const status = require('../utils/httpStatusText');
// const {ADMIN} = require('../utils/user_status');

module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)) {
            return res.status(403).json({status: status.FAIL, message: "You are not allowed to access this route"})
        }
        next();
    }
}
