const LocalStrategy = require('passport-local').Strategy;
const RememberStrategy = require('passport-remember-me').Strategy;
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

// Model
const User = require('./../models/users');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    });

    passport.use (
        new LocalStrategy( {usernameField : 'email'}, async (email, password, done) => {
            
            const user = await User.findOne({email : email});
            if(!user) {
                return done(null, false, {message : "That email is not registered"});
            }

            try {
                const isMatchPassword = await bcrypt.compare(password, user.password);
                if(isMatchPassword) {
                    return done(null, user);
                } else {
                    return done(null, false, {message : "Passowrd incorrect"});
                }
            } catch(e) {
                return done(e);
            }
        })
    );

    // Remember me Strategy
    const verifyToken = async(token, done) => {
        console.log('verifytoken called', token);
        try {
            const user = await User.findOne({ rememberMe : token });
            done(null, user);
        } catch(e) {
            console.log("No user token", + e);
        }
    }

    // Invalidated after being used
    const issueToken = async (user, done) => {
        console.log('issuesToken called', user);
        const token = uuid.v4();
        user.rememberMe = token;
        try {
            await user.save();
            done(null, token);
        } catch(e) {
            console.log("Invalidated error" + e);
        }
    };

    passport.use(new RememberStrategy(verifyToken, issueToken));

    
}


