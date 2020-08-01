const express = require('express');
const moment = require('moment-timezone');
const multer =  require('multer');
const router = new express.Router();

// Models
const RequestMitra = require('../models/requestMitra');

const {auth} = require('./../middleware/auth');

router.get('/', auth, (req, res) => {
    res.render('dashboard/dashboard-beta', {
        title : "Dashboard"
    });
});

router.get('/mitra/kelola', auth, async (req, res) => {
    try {
        const requestMitra = await RequestMitra.find({}).populate({ path: 'owner' }).exec();
        requestMitra.forEach(rm => {
            rm.tanggalDibuat = moment(rm.createdAt).tz('Asia/Jakarta').locale('id').format('LL');
        });
        res.render('dashboard/kelola_mitra', {
            title : "Kelola Mitra",
            listData : requestMitra
        });
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});





module.exports = router;