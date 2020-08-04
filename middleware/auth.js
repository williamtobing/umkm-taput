const auth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    req.flash('errorAuth', 'Login First');
    res.redirect('/user/login');
}

const notAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();   
}

const authIsMitra = (req, res, next) => {
    if(req.user.isMitra === true) {
        return next();
    }
    req.flash('error', 'Not Authorized');
    res.redirect('/user/profil');
};

const authIsAdmin = (req, res, next) => {
    if(req.user.isAdmin === true) {
        return next();
    }
    req.flash('error', 'Not Authorized');
    res.redirect('/user/profil');
};


module.exports = { auth, notAuth, authIsMitra, authIsAdmin };