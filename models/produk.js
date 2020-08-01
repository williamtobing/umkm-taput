const mongoose = require('mongoose');

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
        type : []
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