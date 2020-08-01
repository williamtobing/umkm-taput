const express = require('express');
const router = new express.Router();
const multer = require('multer');
const moment = require('moment-timezone');

const Produk = require('../models/produk');

const {auth} = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        await req.user.populate({
            path : 'produk_me'
        }).execPopulate();
        req.user.produk_me.forEach((produk) => {
            produk.tanggalDitambahkan = moment(produk.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
        });
        res.render('dashboard/produk_beta', {
            title : "Produk",
            listProduk : req.user.produk_me
        });
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

router.get('/tambah', auth, (req, res) => {
    res.render('dashboard/tambah_produk_beta', {
        title : "Tambah Produk"
    });
});

const upload = multer({
    limits : {
        fileSize : 1024*1024*6  
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.toLowerCase().match(/\.jpg|jpeg|png/)){
            return cb(new Error('Please upload an image')) ;
        }

        cb(undefined, true);
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

router.post('/tambah', auth, upload.single('gambar'), async (req, res) => {
    const produk = new Produk({
        ...req.body,
        gambar : req.file.buffer,
        owner : req.user._id
    });
    try {
        await produk.save();
        req.flash('success', 'Produk berhasil ditambahkan');
        res.redirect('/dashboard/produk');
    } catch(e) {
        res.json({
            message : e.message
        });
    }
}, (error, req, res, next) => {
    req.flash('error', error.message);
    res.redirect('/dashboard/produk/tambah');
});

router.get('/:id', async (req, res) => {
    try {
        const produk = await Produk.findById(req.params.id).populate('owner').exec();
        produk.formatted = produk.deskripsiProduk.split('\n');
        res.render('dashboard/detail_produk_beta', {
            title : "Detail Produk",
            produk : produk
        });
    } catch(e) {
        res.json({
            message : e.message
        });
    }
    
});

module.exports = router;