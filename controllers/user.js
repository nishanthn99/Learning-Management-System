const {User}=require('../models');

module.exports.postUsers=async (req,res)=>{
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const user = await User.newUser(firstName, lastName, email, password, role);
        req.login(user, (err) => {
            if (err) {
                console.log(err);
            }
            if(role=="Educator"){
            res.redirect('/dashboard-edu')}
            else{
                res.redirect('/dashboard-stu')
                }
        })
        console.log(`inserted with id${user.id}`)
    }
    catch (err) {
        console.log(err)
    }
}


module.exports.showIndex=(req, res) => {
    res.render('index', { title: "Welcome to Learning Management System" })
}

module.exports.showSignup=(req, res) => {
    res.render('signup', { title: "Create a New Account in Learning Management System", _csrf: req.csrfToken() })
}

module.exports.showLogin=(req, res) => {
    res.render('login', { title: "LogIn To Your Learning Management System Account", _csrf: req.csrfToken() })
}

module.exports.showForgotpasswaord=(req,res)=>{
    res.render('forgotpassword', { title: "Forgot Password in Learning Management System", _csrf: req.csrfToken() })

}

module.exports.postSession=(req,res)=>{
    if (req.user.role == 'Educator') {
        res.redirect('/dashboard-edu');
    }
    else {
        res.redirect('/dashboard-stu');
    }
}

module.exports.logout=(req,res)=>{
    req.logout();
    res.redirect('/login');
}

module.exports.resetPassword=async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        await user.update({ password: password })
        res.redirect('/login')
    }
    catch (err) {
        console.log(err)
    }
}