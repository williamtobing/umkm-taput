const express = require('express');
const passport = require('passport');
const router = new express.Router();
const uuid = require('uuid');

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
        res.json({
            message : e.message
        });
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
            console.log(req.user);
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

module.exports = router;