const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: function(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    password:{
        type: String,
    },
    resetLink:{
        data: String,
    },
    date:{
        type: Date,
        default: Date.now()
    },
    tasks: {
        type: mongoose.Schema.Types.Array,
        ref: 'Task'
    },
    token:{
        type: String
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;