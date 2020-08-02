const express = require('express');
const moment = require('moment-timezone');
const router = new express.Router();

const Kegiatan = require('./../models/kegiatan');

router.get('/kegiatan', async (req, res) => {
    try {
        const kegiatan = await Kegiatan.find({}).sort({createdAt : 'desc'});
        kegiatan.forEach(keg => {
            keg.tanggalDitambahkan = moment(keg.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
        });
        res.render('kegiatan', {
            title : "Kegiatan",
            listData : kegiatan
        })
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

router.get('/kegiatan/detail/:id', async (req, res) => {
    try {
        const kegiatan = await Kegiatan.findById(req.params.id);
        kegiatan.tanggalDitambahkan = moment(kegiatan.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
        kegiatan.formatted = kegiatan.deskripsiKegiatan.split('\n');
        res.render('detail-kegiatan', {
            title : "Detail Kegiatan",
            data : kegiatan
        })
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

router.get('/kegiatan/gambar/:id', async(req, res) => {
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

module.exports = router;