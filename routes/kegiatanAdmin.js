const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const moment = require('moment-timezone');
const router = express.Router();
const escapeRegex = require('./../function/search');

const { auth, authIsAdmin } = require('./../middleware/auth');

const Kegiatan = require('./../models/kegiatan');

router.get('/kegiatan', auth, authIsAdmin,  async (req, res) => {
    try {
        let kegiatan;
        if(!req.query.search) {
            kegiatan = await Kegiatan.find({}).sort({createdAt : 'desc'});
            kegiatan.forEach(keg => {
                keg.tanggalDiupload = moment(keg.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
            });
        } else {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            kegiatan = await Kegiatan.find({judul : regex});
            kegiatan.forEach(keg => {
                keg.tanggalDiupload = moment(keg.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
            });
        }
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

router.get('/kegiatan/detail/:id', auth, authIsAdmin, async(req, res) => {
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

router.get('/kegiatan/tambah', auth, authIsAdmin, (req, res) => {
    res.render('admin/tambah-kegiatan-beta', {
        title : "Admin Tambah Kegiatan"
    });
});

router.get('/kegiatan/detail/edit/:id', auth, authIsAdmin, async (req, res) => {
    try {
        const kegiatan = await Kegiatan.findById(req.params.id);
        res.render('admin/edit-kegiatan-beta', {
            title : "Admin Tambah Kegiatan",
            data : kegiatan
        });
    } catch(e) {
        res.json({
            message : e.message
        })
    }
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
router.get('/kegiatan/gambar/:id', auth, authIsAdmin, async (req, res) => {
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

router.post('/kegiatan/tambah', auth, authIsAdmin, upload.single('gambar'), async (req, res) => {
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

// update kegiatan
router.patch('/kegiatan/detail/edit/:id', auth, authIsAdmin, upload.single('gambar'), async (req, res) => {
    let kegiatan;
    try {
        if(req.file !== undefined) {
            kegiatan = await Kegiatan.findByIdAndUpdate(req.params.id, { 
                ...req.body,
                gambar : await sharp(req.file.buffer).webp().toBuffer()
            },{
                new : true
            });
        } else {
            kegiatan = await Kegiatan.findByIdAndUpdate(req.params.id, {...req.body}, {new : true});
        }
        req.flash('success', 'Produk berhasil di update');
        res.redirect(`/admin/kegiatan/detail/${kegiatan._id}`);
    } catch(e) {
        req.flash('error', 'Gagal mengupdate file');
        res.redirect(`/admin/kegiatan/detail/edit/${kegiatan._id}`)
    }
}, async (error, req, res, next) => {
    const kegiatan = await Kegiatan.findById(req.params.id);
    req.flash('error', 'Gagal mengupdate file : ' + error.message);
    res.redirect(`/admin/kegiatan/detail/edit/${kegiatan._id}`)
});

router.delete('/kegiatan/detail/delete/:id', auth, authIsAdmin,  async(req, res) => {
    try {
        const kegiatan = await Kegiatan.findByIdAndDelete(req.params.id);
        req.flash('success', 'Berhasil menghapus');
        res.redirect('/admin/kegiatan');
    } catch(e) {
        req.flash('error', 'Gagal menghapus produk ' + e.message);
        res.redirect('/admin/kegiatan');
    }
});



module.exports = router;