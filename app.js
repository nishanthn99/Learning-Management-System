const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const path=require('path');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine','ejs')

const {User}=require('./models')
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render('index',{title:"Welcome to Learning Management System"})
});

app.get('/signup',(req,res)=>{
    res.render('signup',{title:"Create a New Account in Learning Management System"})
});

app.post('/newuser',async(req,res)=>{
    const {firstName,lastName,email,password,role}=req.body;
    const user=await User.newUser(firstName,lastName,email,password,role);
    console.log(`inserted with id${user.id}`)
    res.redirect('/dashboard')
})

app.get('/login',(req,res)=>{
    res.render('login',{title:"LogIn To Your Learning Management System Account"})
});

app.post('/session',(req,res)=>{
    const {firstName,lastName,email,password,role}=req.body;
})

app.get('/dashboard',(req,res)=>{
    res.render('dashboard',{title:"Welcome to Your Learning Management System Dashboard"})
})

app.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword',{title:"Forgot Password in Learning Management System"})
});

app.post('/resetpassword',(req,res)=>{
    const {email}=req.body;
})


module.exports=app;