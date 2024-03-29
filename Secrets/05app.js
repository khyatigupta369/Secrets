require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

// db
app.use(session({
    secret:"our little secret",
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

const db = require('./config/key').mongoURI;
// const { Passport } = require('passport');

mongoose.connect(db,{useNewUrlParser:true})
.then(console.log('MongoDb connected'))
.catch(err=>console.log(err));
// mongoose.set('useCreateIndex',true);


const userSchema = new mongoose.Schema({
    username:String,
    password:String
});

// plugin
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',userSchema)
// capital U in User model

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.get('/secrets',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('secrets');
    } else{
        res.render('/login');
    }
});

app.get('/logout',(req,res)=>{
req.logout();
res.redirect('/login');
})

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/register',(req,res)=>{
    User.register({username:req.body.username},req.body.password,(err,User)=>{
        if(err) {
            console.log(err);
            res.redirect('/register');
        }
        else {
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/secrets');
            })
        }
    })
});

app.post('/login',(req,res)=>{
    const user = new User({
        username : req.body.username,
        password : req.body.password
    })

    req.login(user,(err)=>{
        if (err) console.log(err)
        else {
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/secrets');
            })
        }
    })
});


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`set up at ${PORT}`);
});


