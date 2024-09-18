const {User,Course,Enrollment,Progress}=require('../models');
const Sequelize=require('sequelize');
const db = require("../models");

module.exports.postUsers=async (req,res)=>{
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const user = await User.newUser(firstName, lastName, email, password, role);
        req.login(user, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('dashboard');
            req.flash('message',"loged in")
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
    req.flash('message',"Logged in Successfully");
    res.redirect('dashboard');
}

module.exports.logout=(req,res)=>{
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        //req.flash("success", "You've been successfully signed out. Come back soon!");
        res.redirect("/login");
    });
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
        req.flash('message',"Password Resetted Successully");
        res.redirect('/login')
    }
    catch (err) {
        console.log(err)
    }
}

module.exports.Dashboard=async(req, res) => {
    const userId=req.user.id;
    let courses = await Course.findAll({
        attributes: [
            'id',
            'coursetitle',
            'educatorId',
            [Sequelize.fn('COUNT', Sequelize.col('Enrollments.id')), 'enrollmentCount']
        ],
        include: [
            {
                model: User,
                as: 'User', // Assuming an alias 'User' exists for Educator
                attributes: ['firstname'],
            },
            {
                model: Enrollment,
                as: 'Enrollments',
                attributes: [], // We just need to count Enrollments
            },
        ],
        group: ['Course.id', 'User.id'],
        subQuery: false,
    });    
    let enrolledCourses = await Enrollment.findAll({
        where: {
            userId,
        }
    });
    const courseIds = enrolledCourses.map(enrollment => enrollment.courseId);
    let userCourses = courses.filter((course) => {
        return courseIds.includes(course.id)
    });
    userCourses = await Promise.all(userCourses.map(async (course) => {
        course.progress = 0; // Assuming progress is initially set to 0
        const progress = await Progress.getCompletionProgress(db, userId, course.id);
        course.progress = progress;
        return course;
    }));
    const myCourses = userCourses.map(course => {
        return {
            id: course.id,
            coursetitle: course.coursetitle,
            educatorId: course.educatorId,
            enrollmentCount: course.getDataValue('enrollmentCount'),
            user: course.getDataValue('User'),
            progress: course.progress
        };
    });
    if (req.accepts("html")) {
        res.render("dashboard", { courses, userCourses, _csrf: req.csrfToken(),currUser:req.user });
    } else {
        res.json({ courses, myCourses, csrfToken: req.csrfToken() });
    }
};  