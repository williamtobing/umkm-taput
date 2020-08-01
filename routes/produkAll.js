const express = require('express');
const router = new express.Router();
const moment = require('moment-timezone');

const Produk = require('../models/produk');

router.get('/', async (req, res) => {
    try {
        let produk;
        if(!req.query.search) {
            produk = await Produk.find({}).populate('owner').exec();
            produk.forEach(prod => {
                prod.tanggalDitambahkan = moment(prod.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
            });
        }
        res.render('produk', {
            title : "Produk",
            listProduk : produk
        });
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

router.get('/gambar/:id', async (req, res) => {
    try {
        const produk = await Produk.findById(req.params.id);
        res.set('Content-Type', 'image/jpg');
        res.send(produk.gambar);
    } catch(e) {
        res.json({
            message : e.message
        });
    }
});

module.exports = router;