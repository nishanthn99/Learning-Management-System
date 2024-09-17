const express = require("express");
const router = express.Router({ mergeParams: true });
const connectEnsureLogin = require("connect-ensure-login");
const courseController = require("../controllers/course");
const { isEducator} = require("../middleware.js");
//all courses
router.get("/", connectEnsureLogin.ensureLoggedIn(), courseController.getCourses);
//create course
router.get("/createcourse", connectEnsureLogin.ensureLoggedIn(), courseController.getCreateCourse);
//post new course
router.post("/", connectEnsureLogin.ensureLoggedIn(),isEducator, courseController.postNewCourse);
//educator
router.get("/:educatorid", connectEnsureLogin.ensureLoggedIn(), courseController.getEducatorCourses);
//progress
router.get("/:educatorid/progress", connectEnsureLogin.ensureLoggedIn(), courseController.progress);
//enroll
router.post("/:courseid/enroll", connectEnsureLogin.ensureLoggedIn(),courseController.enroll);



module.exports = router;