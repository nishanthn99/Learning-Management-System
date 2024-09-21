const {Course,Enrollment,User}=require('../models');
module.exports.getCreateCourse=(req,res)=>{
    res.render('createcourse',{title:"Create a New Course in Learning Management System",_csrf:req.csrfToken()});
}

module.exports.postNewCourse=async(req,res)=>{
    const id=JSON.parse(req.user.id);
    try{
        const course=await Course.addCourse(req.body.title,id);
        req.flash('message',"Course Created Successfully")
        res.redirect(`course/${course.id}/chapter/createchapter`);
    }
    catch(err){
        console.log(err);
        }
}

module.exports.getEducatorCourses = async (req, res) => {
    try {
        let educatorId = req.params.educatorid;
        let myCourses = await Course.findAll({ where: { educatorId } });
        res.render("mycourse.ejs", { myCourses, csrfToken: req.csrfToken() });
    }
    catch (err) {
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};
module.exports.progress = async (req, res) => {
    const educatorId = req.params.educatorid;
    const Educator = await User.findByPk(educatorId);
    let courses = await Course.findAll({ where: { educatorId } });
    let totalEnrollments = await Enrollment.getTotalEnrollments(educatorId);
    courses = await Promise.all(courses.map(async (course) => {
        course.enrollmentCount = await Enrollment.getEnrollmentCount(course.id);
        course.relativePopularity = Math.floor((course.enrollmentCount / totalEnrollments) * 100);
        return course;
    }));
    courses.sort((a, b) => b.relativePopularity - a.relativePopularity);
    res.render("courseprogress", { Educator, courses, _csrf: req.csrfToken() ,title:"Progess"});
};


module.exports.enroll = async (req, res) => {
    const userId = req.user.id;
    const { courseid } = req.params;

    try {
        // Check if the course exists
        const course = await Course.findByPk(courseid);
        if (!course) {
            req.flash("error", "Course not found");
            return res.redirect(`/course/${courseid}/chapter`);
        }

        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({
            where: {
                userId,
                courseId:courseid,
            },
        });

        if (existingEnrollment) {
            req.flash("error", "User is already enrolled in this course");
            return res.redirect(`/course/${courseid}/chapter`);
        }

        // Enroll the user in the course
        const EducatorId = course.EducatorId;
        await Enrollment.create({
            userId,
            courseId:courseid,
            EducatorId,
        });
        req.flash("message", "Enrolled Successfully!!");
        return res.redirect(`/course/${courseid}/chapter`);
    } catch (error) {
        
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}