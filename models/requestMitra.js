const mongoose = require('mongoose');

const requestMitraSchema = new mongoose.Schema({
    nik : {
        type : String,
        required : true,
        trim : true
    },
    fotoKtp : {
        type : Buffer,
        required : true
    },
    tentang : {
        type : String,
        required : true,
        trim : true
    },
    status : {
        type : String,
        default : "0" // 0 waiting 1 approved 9 rejected
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true
    },
}, {
    timestamps : true
});

module.exports = mongoose.model('requestMitra', requestMitraSchema);