const express = require('express');
const multer =  require('multer');
const router = new express.Router();

const {auth} = require('./../middleware/auth');

const RequestMitra = require('./../models/requestMitra');


router.get('/request/mitra', async (req, res) => {
    try {
        await req.user.populate({
            path : 'mitra_request'
        }).execPopulate();
        req.user.mitra_request.forEach((req) => {
            req.formattedTentang = req.tentang.split('\n');
        });
        res.render('dashboard/request_mitra', {
            title : "Request Mitra",
            request : req.user.mitra_request
        });
    } catch(e) {
        res.json({
            message : e.message
        })
    }
});

// Download
router.get('/request/mitra/download/:id', async (req, res) =>{
    try {
        const requestMitra = await RequestMitra.findById(req.params.id);
        if(!requestMitra || !requestMitra.fotoKtp){
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg');
        res.send(requestMitra.fotoKtp);
    } catch(e) {
        res.status(400).json({
            message : e.message 
        })
    }
});

router.get('/getarticle-image/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if(!article || !article.gambar) {
            throw new Error();
        }
        res.set('Content-Type' , 'image/webp');
        res.send(article.gambar);
    } catch (e) {
        res.status(404).send(e);
    }
});

const upload = multer({
    limits : 1024*1024*6,
    fileFilter(req, file, cb) {
        if(!file.originalname.toLowerCase().match(/\.jpg|jpeg|png/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true);
    }
});

router.post('/request/mitra', auth, upload.single('fotoKtp'), async (req, res) => {
    try {
        const requestMitra = new RequestMitra({
            ...req.body,
            owner : req.user._id,
            fotoKtp : req.file.buffer,
        });
        await requestMitra.save();
        req.flash('success', 'Request berhasil dibuat');
        res.redirect(`/dashboard/request/mitra`);
    } catch(e) {
        res.json({
            message : e.message
        });
    }
}, (error, req, res, next) => {
    req.flash('error', `${error.message}`);
    res.redirect('/dashboard/request/mitra');
});



module.exports = router;