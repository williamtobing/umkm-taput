const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    namaLengkap : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 6,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error('The password can\'t contain "password"');  
            }
        }
    },
    noTelepon : {
        type : String,
        required : true,
        trim : true
    },
    rememberMe : {
        type : String
    },
    isMitra : {
        type : String,
        default : "0", // 0 for waiting 1 for approved 9 for rejected
    },
    isAdmin : {
        type : Boolean,
    }
}, {
    timestamps : true
});

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

module.exports = mongoose.model('Users', userSchema);