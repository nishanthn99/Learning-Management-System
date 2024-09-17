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

router.get("/forgotpassword", userController.showForgotpasswaord);

router.post("/resetpassword", userController.resetPassword);

router.get('/dashboard',ensureLogin.ensureLoggedIn(),userController.Dashboard);

module.exports = router;