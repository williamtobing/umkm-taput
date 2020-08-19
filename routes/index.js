const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title : "UMKM TAPUT"
    });
});

router.get('/tentang', (req, res) => {
    res.render('tentang', {
        title : "Tentang"
    })
});

module.exports = router;