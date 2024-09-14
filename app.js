const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

//adding routes in separate files
const userRoute = require('./routes/userRoute');
const courseRoute = require('./routes/courseRoute');
const chapterRoute = require('./routes/chapterRoute');
const pageRoute = require('./routes/pageRoute');


const cookieParser = require('cookie-parser');
const tinycsrf = require('tiny-csrf');
app.use(cookieParser('Shh! this is a secreat dont share this'))
app.use(tinycsrf('this_should_be_32_character_long', ['PUT', 'POST', 'DELETE']))

//authetication
const session = require('express-session');
const localStrategy = require('passport-local')
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

app.use(session({
    secret: 'this_should_be_32_character_long',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (username, password, done) => {
    User.findOne({
        where: {
            email: username,
            password: password
        }
    })
        .then((user) => {
            return done(null, user)
        })
        .catch((err) => {
            return err
        })
}));

passport.serializeUser((user, done) => {
    console.log(`Serailized user with session id ${user.id}`)
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    User.findByPk(id)
        .then((user) => {
            done(null, user)
        })
        .catch((err) => {
            done(err, null)
        })
})


const { User,Course,Chapter,Page} = require('./models');
app.use(express.static(path.join(__dirname, 'public')));


// app.get('/createcourse',)

// app.post('/newcourse',ensureLogin.ensureLoggedIn(),);

// app.get('/:id/createchapter',ensureLogin.ensureLoggedIn(),)

// app.post('/:id/newchapter',ensureLogin.ensureLoggedIn(),)

//app.get('/:courseid/createpage',ensureLogin.ensureLoggedIn(),)

app.use('/',userRoute);
app.use('/course',courseRoute);
app.use('/course/:courseid/chapter',chapterRoute);
app.use('/course/:courseid/page',pageRoute);
app.get('*',(req,res)=>{
    res.status(404).send("Page Not Found");
})

module.exports = app;