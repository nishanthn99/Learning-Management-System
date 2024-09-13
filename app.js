const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const path=require('path');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine','ejs')

const cookieParser=require('cookie-parser');
const tinycsrf=require('tiny-csrf');
app.use(cookieParser('Shh! this is a secreat dont share this'))
app.use(tinycsrf('this_should_be_32_character_long',['PUT','POST','DELETE']))

//authetication
const session = require('express-session');
const localStrategy=require('passport-local')
const passport=require('passport')
const ensureLogin=require('connect-ensure-login')

app.use(session({
    secret: 'this_should_be_32_character_long',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge:24*60*60*1000 }
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy({
    email:'email',password:'password'
},(email,password,done)=>{
    User.findOne({where:{
        email,
        password
    }})
    .then((email)=>{
        return done(null,email)
    })
    .catch((err)=>{
        return done(null,false)
    })
}));

passport.serializeUser((user,done)=>{
    console.log(`Serailized user with session id ${user.id}`)
    done(null,user.id)
})
passport.deserializeUser((id,done)=>{
    User.findByPk(id)
    .then((user)=>{
        done(null,user)
    })
    .catch((err)=>{
        done(err,null)
    })
})


const {User}=require('./models');
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render('index',{title:"Welcome to Learning Management System"})
});

app.get('/signup',(req,res)=>{
    res.render('signup',{title:"Create a New Account in Learning Management System",_csrf:req.csrfToken()})
});

app.post('/newuser',async(req,res)=>{
    const {firstName,lastName,email,password,role}=req.body;
    const user=await User.newUser(firstName,lastName,email,password,role);
    console.log(`inserted with id${user.id}`)
    res.redirect('/dashboard')
})

app.get('/login',(req,res)=>{
    res.render('login',{title:"LogIn To Your Learning Management System Account",_csrf:req.csrfToken()})
});

app.post('/session',(req,res)=>{
    const {email,password}=req.body;
    
})

app.get('/dashboard',(req,res)=>{
    res.render('dashboard',{title:"Welcome to Your Learning Management System Dashboard"})
})

app.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword',{title:"Forgot Password in Learning Management System"})
});

app.put('/resetpassword',(req,res)=>{
    const {email}=req.body;
})


module.exports=app;