require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

// db

const db = require('./config/key').mongoURI;

mongoose.connect(db,{useNewUrlParser:true})
.then(console.log('MongoDb connected'))
.catch(err=>console.log(err));


const userSchema = new mongoose.Schema({
    username:String,
    password:String
});

// plugin

const User = mongoose.model('User',userSchema)
// capital U in User model

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/register',(req,res)=>{
    const newUser = new User({
        username:req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err)=>{
        if(err) 
        console.log(err);
        else 
        res.render('secrets');
    });
});

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({username:username},(err,foundUser)=>{
        if(err)
        console.log(err);
        else{
            if(foundUser){
                if(foundUser.password==password)
                    res.render('secrets');
                else 
                    res.send('Incorrect Password!!!');
            }
            else 
                res.send('User not registered!Kindly register');
        }
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`set up at ${PORT}`);
});


