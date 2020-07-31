require('./db/mongoose');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session'); 

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '/public');

app.set('view engine', 'ejs');
app.use(express.static(publicDirectoryPath));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Flash
app.use(flash());

// Express session
// Express Session
app.use(
    session({
        secret : process.env.SESSION_SECRET || 'secret',
        resave : true,
        saveUninitialized : true
    })
);

app.use(function (req,res, next){
    res.locals.successDone = req.flash('success');
    res.locals.errorFailed = req.flash('error');

    next();
});

// routes
app.use('/user', require('./routes/user'));

app.listen(port, function () {
    console.log(`Server started on ${port}`);
});
