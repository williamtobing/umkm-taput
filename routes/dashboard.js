const express = require('express');
const moment = require('moment-timezone');
const multer =  require('multer');
const router = new express.Router();

// Models
const RequestMitra = require('../models/requestMitra');

const {auth, authIsMitra, authIsAdmin} = require('./../middleware/auth');

router.get('/', auth, async (req, res) => {
    if(req.user.isAdmin) {
        const requestMitra = await RequestMitra.find({status : "0"});
        return res.render('dashboard/dashboard-beta', {
            title : "Dashboard",
            notifMenunggu : requestMitra.length 
        });
    }
    res.render('dashboard/dashboard-beta', {
        title : "Dashboard"
    });
});

router.get('/umkm', auth, authIsMitra, (req, res) => {
    res.render('user/profil_umkm', {
        title : "Profil UMKM"
    });
});

router.get('/mitra/kelola', auth, authIsAdmin, async (req, res) => {
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