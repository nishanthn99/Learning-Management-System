const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const userController = require("../controllers/user.js");
const ensureLogin=require('connect-ensure-login');

router.get("/", userController.showIndex);

router.get("/signup", userController.showSignup);

router.post("/newuser",userController.postUsers);

router.get("/login",userController.showLogin);
router.post(
  "/session",
  passport.authenticate("local",  { failureRedirect: '/login', failureFlash: true }),
  userController.postSession
);
router.get("/logout",userController.logout);

router.get("/forgotpassword", userController.resetPassword);

router.post("/resetpassword", userController.resetPassword);

router.get('/dashboard-edu',ensureLogin.ensureLoggedIn(),(req, res) => {
  res.render('dashboard-edu', { title: "Welcome to Your Learning Management System Dashboard",role:"Educator"})
});

router.get('/dashboard-stu', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('dashboard-stu', { title: "Welcome to Your Learning Management System Dashboard",role:"Student"})
});

module.exports = router;