const express = require('express');
const router = new express.Router();

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

module.exports = router;