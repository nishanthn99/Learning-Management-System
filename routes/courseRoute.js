const express = require("express");
const router = express.Router({ mergeParams: true });
const connectEnsureLogin = require("connect-ensure-login");
const courseController = require("../controllers/course");
const { isEducator} = require("../middleware.js");
//all courses
//router.get("/", connectEnsureLogin.ensureLoggedIn(), courseController.getCourses);
//create course
router.get("/", connectEnsureLogin.ensureLoggedIn(), courseController.getCreateCourse);
//post new course
router.post("/", connectEnsureLogin.ensureLoggedIn(),isEducator, courseController.postNewCourse);



module.exports = router;