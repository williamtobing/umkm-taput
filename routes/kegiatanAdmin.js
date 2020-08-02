const express = require('express');
const router = express.Router();

router.get('/kegiatan', (req, res) => {
    res.render('admin/kegiatan-beta', {
        title : "Admin Kegiatan"
    });
});

router.get('/tambah', (req, res) => {
    res.render('admin/tambah-kegiatan-beta', {
        title : "Admin Tambah Kegiatan"
    });
});

module.exports = router;