const express = require('express');
const passport = require('passport');
const router = new express.Router();
const multer = require('multer');
const uuid = require('uuid');
const sharp = require('sharp');

const { auth } = require('./../middleware/auth');

const User = require('./../models/users');

router.get('/register', (req, res) => {
    res.render('user/sign-up', {
        title : "Masuk atau Daftar - UMKM TAPUT"
    });
});

router.post('/register', async (req, res) => {
    const { email } = req.body;
    const emailExist = await User.findOne({ email : email });
    if(emailExist) {
        req.flash('error', 'Email already registered');
        return res.redirect('/user/register');
    }
    const user = new User(req.body);
    try {
        await user.save();
        req.flash('success', 'Register Successfully');
        res.redirect('/user/login');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/user/register');
    }
});

router.get('/login', (req, res) => {
    res.render('user/sign-in', {
        title : "Masuk atau Daftar - UMKM TAPUT"
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect : '/user/login',
        failureFlash : true
    })(req, res, next);
}, async (req, res, next) => {
        if(!req.body.rememberMe) {
            return next();
        }
        if(!req.user.rememberMe) {
            req.user.rememberMe = uuid.v4();
            await req.user.save();
        }
        res.cookie('remember_me', req.user.rememberMe, {
            path: '/',
            httpOnly : true,
            maxAge : 604800000 //7 days
        });
        next();
}, (req, res) => {
    req.flash('success', "Login Successfully");
    res.redirect('/');
});

router.post('/logout', auth, (req, res) => {
    req.logout();
    res.cookie('remember_me', '')
    res.redirect('/user/login');
});

router.get('/profil', auth, (req, res) => {
    res.render('user/profil-beta', {
        title : "Profil"
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

router.get('/profile/gambar/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.gambar) {
            throw new Error();
        }
        res.set('Content-Type' , 'image/jpg');
        res.send(user.gambar);
    } catch(e) {
        res.status(404).send(e);
    }
});

router.get('/profile/umkm/gambar/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.umkm.gambarUMKM) {
            throw new Error();
        }
        res.set('Content-Type' , 'image/jpg');
        res.send(user.umkm.gambarUMKM);
    } catch(e) {
        res.status(404).send(e);
    }
});


router.post('/profile/update', upload.single('gambar'), async (req, res) => {
    try {
        if(req.file !== undefined) {
            const sharpBuffer = await sharp(req.file.buffer).webp().toBuffer();
            req.user.gambar = sharpBuffer;
            req.user.namaLengkap = req.body.namaLengkap;
            req.user.noTelepon = req.body.noTelepon;
            req.user.deskripsi = req.body.deskripsi;
            await req.user.save();
        } else {
            req.user.namaLengkap = req.body.namaLengkap;
            req.user.noTelepon = req.body.noTelepon;
            req.user.deskripsi = req.body.deskripsi;
            await req.user.save();
        }
        req.flash('success', 'Berhasil mengupdate profil')
        res.redirect('/user/profil');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/user/profil');
    }
}, (error, req, res, next) => {
    req.flash('error', error.message);
    res.redirect('/user/profil');
});

router.post('/profile/umkm/update', upload.single('gambarUMKM'), async (req, res) => {
    try {
        if(req.file !== undefined) {
            const sharpBuffer = await sharp(req.file.buffer).webp().toBuffer();
            req.user.umkm.gambarUMKM = sharpBuffer;
            req.user.umkm.namaUMKM = req.body.umkm.namaUMKM;
            req.user.noTelepon = req.body.noTelepon;
            req.user.umkm.tentang = req.body.umkm.tentang;
            await req.user.save();
        } else {
            req.user.umkm.namaUMKM = req.body.umkm.namaUMKM;
            req.user.noTelepon = req.body.noTelepon;
            req.user.umkm.tentang = req.body.umkm.tentang;
            await req.user.save();
        }
        req.flash('success', 'Berhasil mengupdate profil')
        res.redirect('/dashboard/umkm');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/dashboard/umkm');
    }
}, (error, req, res, next) => {
    req.flash('error', error.message);
    res.redirect('/dashboard/umkm');
});

module.exports = router;