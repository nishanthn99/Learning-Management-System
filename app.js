const express=require('express');
const app=express();
const bodyParser=require('body-parser');

app.set('view engine','ejs')


app.get('/',(req,res)=>{
    res.render('index',{title:"Welcome to Learning Management System"})
});

app.get('/signup',(req,res)=>{
    res.render('signup',{title:"Create a New Account in Learning Management System"})
});

app.post('/newuser',(req,res)=>{
    const {username,password}=req.body;
})

app.get('/login',(req,res)=>{
    res.render('login',{title:"LogIn To Your Learning Management System Account"})
});

app.post('/dashboard',(req,res)=>{
    const {username,password}=req.body;
})

app.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword',{title:"Forgot Password in Learning Management System"})
});

app.post('/resetpassword',(req,res)=>{
    const {email}=req.body;
})


module.exports=app;