const Task = require("../models/task-model");
const User = require("../models/user");
const generateJWT = require("../utils/generateJWT");
const status = require('../utils/httpStatusText');
const bcrypt = require('bcryptjs');


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
        const {name, email, password} = req.body;
        const passwordHashed = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: passwordHashed
        });

        const token = await generateJWT({
            id: newUser._id,
            email: newUser.email
        });

        newUser.token = token;

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
                email: user.email
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

module.exports = {
    getAllUsers,
    register,
    login
}