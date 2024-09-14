const express = require("express");
const router = express.Router({ mergeParams: true });
const connectEnsureLogin = require("connect-ensure-login");
const courseController = require("../controllers/courses");
const { isEducator} = require("../middleware.js");
//all courses
router.get("/", connectEnsureLogin.ensureLoggedIn(), courseController.getCourses);
//create course
router.get("/createcourse", connectEnsureLogin.ensureLoggedIn(), courseController.getCreateCourse);
//post new course
router.post("/newcourse", connectEnsureLogin.ensureLoggedIn(),isEducator, courseController.postNewCourse);


module.exports = router;