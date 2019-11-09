const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
   User.findById(id,(err,user)=>{
      done(err,user);
   });
});

passport.use('local.signup',new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback:true
},
    (req,login,password,done)=>{
        req.checkBody('password','invalid password').notEmpty().isLength({min:4});
        let errors = req.validationErrors();
        if(errors){
            let messages  = [];
            errors.forEach((error)=>{
                messages.push(error.msg);
            });
            return done(null,false,req.flash('error',messages));

        }

        User.findOne({'login':login},(err,user)=>{
            if(err) return done(err);
            if(user)return done(null,false,{message:'Email already in use!'});
            const newUser = new User();
            newUser.login = login;
            newUser.password = newUser.encryptPassword(password);
            newUser.save((err,result)=>{
                if(err) return done(err);
                return done(null,newUser);
            });
        });
}));






passport.use('local.signin',new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback:true
    },
    (req,login,password,done)=>{
        req.checkBody('password','invalid password').notEmpty();
        let errors = req.validationErrors();
        if(errors){
            let messages  = [];
            errors.forEach((error)=>{
                messages.push(error.msg);
            });
            return done(null,false,req.flash('error',messages));

        }

        User.findOne({'login':login},(err,user)=>{
            if(err) return done(err);
            if(!user)return done(null,false,{message:'Not found'});
            console.log(1);
            if(!user.validPassword(password)){
                return done(null,false,{message:'Wrong password'});
            }
            req.session.auth = true;
            req.session.user = user; // Need to be solved
            return done(null,user);

        });
    }));
