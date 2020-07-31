const express = require('express');
const router = new express.Router();

const {auth} = require('./../middleware/auth');

router.get('/', auth, (req, res) => {
    res.render('dashboard/dashboard-beta', {
        title : "Dashboard"
    });
});

module.exports = router;