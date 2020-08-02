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

router.get('/:id', async (req, res) => {
    try {
        const produk = await Produk.findById(req.params.id).populate('owner').exec();
        produk.formatted = produk.deskripsiProduk.split('\n');
        console.log(produk.owner);
        res.render('detail-produk', {
            title : "Detail Produk",
            produk : produk
        });
    } catch(e) {
        res.json({
            message : e.message
        });
    }
    
});

router.get('/gambar/:id', async (req, res) => {
    try {
        const produk = await Produk.findById(req.params.id);
        res.set('Content-Type', 'image/webp');
        res.send(produk.gambar);
    } catch(e) {
        res.json({
            message : e.message
        });
    }
});

router.get('/gambar/mitra/:id', async (req, res) => {
    try {
        const produk = await Produk.findById(req.params.id).populate('owner').exec();
        if(!produk || !produk.owner.umkm.gambarUMKM) {
            throw new Error();
        }
        res.set('Content-Type' , 'image/webp');
        res.send(produk.owner.umkm.gambarUMKM);
    } catch(e) {
        res.status(404).send(e);
    }
});

module.exports = router;