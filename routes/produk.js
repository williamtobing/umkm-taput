const express = require('express');
const router = new express.Router();

const {auth} = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    res.render('dashboard/produk_beta', {
        title : "Produk"
    });
});

router.get('/tambah', auth, (req, res) => {
    res.render('dashboard/tambah_produk_beta', {
        title : "Tambah Produk"
    });
});

router.post('/tambah', auth, (req, res) => {
    console.log(req.body);
});

module.exports = router;