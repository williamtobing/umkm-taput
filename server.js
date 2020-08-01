require('./db/mongoose');
const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session'); 
const app = express();
const port = process.env.PORT || 3000;

// Passport Config
require('./middleware/passport-config')(passport);



app.set('view engine', 'ejs');
const publicDirectoryPath = path.join(__dirname, '/public');
app.use(express.static(publicDirectoryPath));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Flash
app.use(flash());

// Express Session
app.use(
    session({
        secret : process.env.SESSION_SECRET || 'secret',
        resave : true,
        saveUninitialized : true
    })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

app.use(function (req,res, next){
    res.locals.user = req.user;
    res.locals.errorAuth = req.flash('errorAuth');
    res.locals.successDone = req.flash('success');
    res.locals.errorFailed = req.flash('error');

    next();
});

// routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/dashboard', require('./routes/requestMitra'));

app.listen(port, function () {
    console.log(`Server started on ${port}`);
});
