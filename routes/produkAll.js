const express = require('express');
const router = new express.Router();
const moment = require('moment-timezone');

const { auth } = require('./../middleware/auth');

const escapeRegex = require('./../function/search');

const Produk = require('../models/produk');

router.get('/', async (req, res) => {
    try {
        let produk;
        if(!req.query.search) {
            produk = await Produk.find({}).populate('owner').exec();
            produk.forEach(prod => {
                prod.tanggalDitambahkan = moment(prod.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
            });
        } else {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            produk = await Produk.find({ judul : regex}).populate('owner').exec();
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
        const produkKomentar = await Produk.findById(req.params.id).populate('komentar.ownerKomentar').exec();
        produkKomentar.komentar.forEach(prod => {
            prod.tanggalDibuat = moment(prod.createdAt).tz('Asia/Jakarta').locale('id').format('LLLL');
        });
        produk.formatted = produk.deskripsiProduk.split('\n');
        // console.log(produk.owner);
        res.render('detail-produk', {
            title : "Detail Produk",
            produk : produk,
            produkKomentar : produkKomentar,
            commentLength : produk.komentar.length
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

// add komentar
router.post('/comment/:id', auth, async (req, res) => {
    try {
        const produk = await Produk.findById(req.params.id);
        produk.komentar.push({...req.body});

        await produk.save();
        req.flash('success', 'Komentar Ditambahkan');
        res.redirect(`/produk/${produk._id}`);
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

module.exports = router;