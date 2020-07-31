const express = require('express');
const router = new express.Router();

const { auth } = require('./../middleware/auth');

router.get('/', (req, res) => {
    res.render('index', {
        title : "Beranda"
    });
});

module.exports = router;