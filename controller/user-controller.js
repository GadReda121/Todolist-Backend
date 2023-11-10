const Task = require("../models/task-model");
const User = require("../models/user");
const generateJWT = require("../utils/generateJWT");
const status = require('../utils/httpStatusText');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: status.SUCCESS,
            results: users.length,
            data:{
                users
            }
        });
    } catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}
const register = async (req, res) => {
    try{
        const {name, email, password, role} = req.body;
        const passwordHashed = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: passwordHashed,
            role 
        });

        const token = await generateJWT({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        });

        newUser.token = token;

        res.cookie("JWT", token, { httpOnly: true });

        res.status(201).json({
            status: status.SUCCESS,
            data: {
                user: newUser
            }
        });
    }
    catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({
                status: status.FAIL,
                message: 'User not found'
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched){
            res.status(401).json({
                status: status.FAIL,
                message: 'Wrong password'
            });
        }

        if(user && isMatched){
            user.tasks = await Task.find({user: user._id});
            const token = await generateJWT({
                id: user._id,
                email: user.email,
                role: user.role
            });

            req.currentUser = user.role;

            res.cookie("JWT", token, {
                httpOnly: false,
                sameSite: "None",
                secure: true,
            });

            res.status(200).json({
                status: status.SUCCESS,
                data: {
                    user,
                    token
                }
            });
        }   
    }catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}


const forgetPassword = async (req, res) => {
    try{
        // 1 - Get user based on POSTed email
        const { email } = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({
                status: status.FAIL,
                message: 'User not found'
            });
        }

        // 2 - Generate the random reset token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '10m'});

        // 3 - Send it to user's email
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}`;
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

        try{
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message
            });
            res.status(200).json({
                status: status.SUCCESS,
                message: 'Token sent to email!',
                link: resetUrl
            });

            return user.updateOne({resetLink: token}, (err, success) => {
                if(err){
                    res.status(400).json({
                        status: status.FAIL,
                        message: 'Reset password link error'
                    });
                } else{
                    res.status(200).json({
                        status: status.SUCCESS,
                        message: 'Reset password link sent successfully'
                    });
                }
            }); 

        }
        catch(e){
            res.status(500).json({
                status: status.FAIL,
                message: e
            });
        }
    } catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}


const resetPassword = async (req, res) => {
    try{
        const { newPassword } = req.body;
        const resetLink = req.params.token;

        if(resetLink){
            jwt.verify(resetLink, process.env.JWT_SECRET, async (err, decodedData) => {
                if(err){
                    res.status(401).json({
                        status: status.FAIL,
                        message: 'Token expired'
                    });
                } else{
                    const user = await User.findOne({resetLink});
                    if(!user){
                        res.status(404).json({
                            status: status.FAIL,
                            message: 'User not found'
                        });
                    }

                    const passwordHashed = await bcrypt.hash(newPassword, 10);
                    user.password = passwordHashed;
                    user.resetLink = '';

                    await user.save();

                    res.status(200).json({
                        status: status.SUCCESS,
                        message: 'Password changed successfully'
                    });
                }
            });
        }
    } catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}


const getProfile = async (req, res) => {
    try{
        const user = await User.findById(req.currentUser.id);
        if(!user){
            res.status(404).json({
                status: status.FAIL,
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: status.SUCCESS,
            data: {
                user
            }
        });
    }catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}


const updateUser = async (req, res) => {
    try{
        // Update user
        const userId = req.currentUser.id;
        const userData = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, userData, {new: true});

        if(!updatedUser){
            res.status(404).json({
                status: status.FAIL,
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: status.SUCCESS,
            data: {
                user: updatedUser
            }
        });

    } catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}


const deleteUser = async (req, res) => {
    try{
        const userId = req.currentUser.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if(!deletedUser){
            res.status(404).json({
                status: status.FAIL,
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: status.SUCCESS,
            data: {
                user: deletedUser
            }
        });
    } catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}


const signOut = async (req, res) => {
    try{
        res.cookie('JWT', '', { httpOnly: true });
        res.status(200).json({
            status: status.SUCCESS,
            message: 'Sign out successfully'
        });
    } catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}


module.exports = {
    getAllUsers,
    register,
    login,
    forgetPassword,
    resetPassword,
    updateUser,
    deleteUser,
    getProfile,
    signOut
}