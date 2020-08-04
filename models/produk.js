const mongoose = require('mongoose');

const komentarSchema = new mongoose.Schema({
    isiKomentar : {
        type : String,
        required : true
    },
    ownerKomentar : {
        type : mongoose.Schema.Types.ObjectId,
        // required : true,
        trim : true,
        ref : 'Users'
    }
}, {
    timestamps : true
});

const produkSchema = new mongoose.Schema({
    judul : {
        type : String,
        required : true,
        trim : true
    },
    gambar : {
        type : Buffer,
        required : true
    },
    deskripsiProduk : {
        type : String,
        required : true,
        trim : true
    },
    komentar : {
        type : [komentarSchema]
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true,
        ref : 'Users'
    },
}, {
    timestamps : true
});

module.exports = mongoose.model('Produk', produkSchema);