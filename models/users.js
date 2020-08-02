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
    deskripsi : {
        type : String,
        trim : true
    },
    rememberMe : {
        type : String
    },
    isMitra : {
        type : Boolean,
        default : false, // 0 for waiting 1 for approved 9 for rejected
    },
    isAdmin : {
        type : Boolean,
    },
    gambar : {
        type : Buffer
    },
    umkm : {
        gambarUMKM : {
            type : Buffer
        },
        namaUMKM : {
            type : String,
            trim : true
        },
        nik : {
            type : String,
            trim : true
        },
        tentang : {
            type : String,
            trim : true
        }
    },
}, {
    timestamps : true
});

userSchema.virtual('mitra_request', {
    ref : 'requestMitra',
    localField : '_id',
    foreignField : 'owner'
});

userSchema.virtual('produk_me', {
    ref : 'Produk',
    localField : '_id',
    foreignField : 'owner'
});

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

module.exports = mongoose.model('Users', userSchema);