const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const moment = require('moment-timezone');
const router = express.Router();

const { auth } = require('./../middleware/auth');

const Kegiatan = require('./../models/kegiatan');

router.get('/kegiatan', auth, async (req, res) => {
    try {
        const kegiatan = await Kegiatan.find({}).sort({createdAt : 'desc'});
        kegiatan.forEach(keg => {
            keg.tanggalDiupload = moment(keg.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
        });
        res.render('admin/kegiatan-beta', {
            title : "Admin Kegiatan",
            listData : kegiatan
        });
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

router.get('/kegiatan/detail/:id', auth, async(req, res) => {
    try {
        const kegiatan = await Kegiatan.findById(req.params.id);
        kegiatan.tanggalDiupload = moment(kegiatan.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
        kegiatan.formatted = kegiatan.deskripsiKegiatan.split('\n');
        res.render('admin/detail-kegiatan-beta', {
            title : "Detail Kegiatan",
            data : kegiatan
        });
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

router.get('/kegiatan/tambah', auth, (req, res) => {
    res.render('admin/tambah-kegiatan-beta', {
        title : "Admin Tambah Kegiatan"
    });
});

const upload = multer({
    limits : 1024*1024*6,
    fileFilter(req, file, cb) {
        if(!file.originalname.toLowerCase().match(/\.jpg|jpeg|png/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true);
    }
});

// Download Image
router.get('/kegiatan/gambar/:id', async (req, res) => {
    try {
        const kegiatan = await Kegiatan.findById(req.params.id);
        if(!kegiatan || !kegiatan.gambar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/webp');
        res.send(kegiatan.gambar);
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

router.post('/kegiatan/tambah', auth, upload.single('gambar'), async (req, res) => {
    const sharpBuffer = await sharp(req.file.buffer).webp().toBuffer();
    const kegiatan = new Kegiatan({
        ...req.body,
        gambar : sharpBuffer,
        owner : req.user._id
    });
    try {
        await kegiatan.save();
        req.flash('success', 'Berhasil menambahkan kegiatan');
        res.redirect('/admin/kegiatan');
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

module.exports = router;