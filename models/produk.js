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
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true
    },
}, {
    timestamps : true
});

module.exports = mongoose.model('Produk', produkSchema);