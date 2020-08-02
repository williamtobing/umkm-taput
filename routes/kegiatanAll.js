const express = require('express');
const router = new express.Router();

const Kegiatan = require('./../models/kegiatan');

router.get('/kegiatan', async (req, res) => {
    try {
        const kegiatan = await Kegiatan.find({}).sort({createdAt : 'desc'});
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