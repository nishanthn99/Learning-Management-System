const {Course,Progress}=require('../models');

module.exports.getCreateCourse=(req,res)=>{
    res.render('createcourse',{title:"Create a New Course in Learning Management System",_csrf:req.csrfToken()});
}

module.exports.postNewCourse=async(req,res)=>{
    const id=JSON.parse(req.user.id);
    try{
        const course=await Course.addCourse(req.body.title,id);
        res.redirect(`course/${course.id}/chapter/createchapter`);
    }
    catch(err){
        console.log(err);
        }
}

module.exports.getCourses = async (req, res) => {
    let userId = req.user.dataValues.id;
    let courses = await Course.findAll({
        attributes: [
            'id',
            'coursetitle',
            'educatorId',
            [Sequelize.fn('COUNT', Sequelize.literal('"Enrollments"."id"')), 'enrollmentCount']
        ],
        include: [
            {
                model: User,
                as: 'User',
                attributes: ['firstname'],
                on: {
                    'educatorId': Sequelize.literal('"User"."id" = "Course"."educatorId"')
                },
            },
            {
                model: Enrollment,
                as: 'Enrollments',
                attributes: [],
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
        res.render("courses.ejs", { courses, userCourses, csrfToken: req.csrfToken() });
    } else {
        res.json({ courses, myCourses, csrfToken: req.csrfToken() });
    }
};

module.exports.getEducatorCourses = async (req, res) => {
    try {
        let EducatorId = req.params.EducatorId;
        let myCourses = await Course.findAll({ where: { EducatorId } });
        res.render("courses/mycourses.ejs", { myCourses, csrfToken: req.csrfToken() });
    }
    catch (err) {
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};
module.exports.progress = async (req, res) => {
    const EducatorId = req.params.EducatorId;
    const Educator = await User.findByPk(EducatorId);
    let courses = await Course.findAll({ where: { EducatorId } });
    let totalEnrollments = await Enrollment.getTotalEnrollments(EducatorId);
    courses = await Promise.all(courses.map(async (course) => {
        course.enrollmentCount = await Enrollment.getEnrollmentCount(course.id);
        course.relativePopularity = Math.floor((course.enrollmentCount / totalEnrollments) * 100);
        return course;
    }));
    courses.sort((a, b) => b.relativePopularity - a.relativePopularity);
    res.render("courses/progress.ejs", { Educator, courses, csrfToken: req.csrfToken() });
};
module.exports.enroll = async (req, res) => {
    const userId = req.user.id;
    console.log("userid", userId);
    const { courseId } = req.params;

    try {
        // Check if the course exists
        const course = await Course.findByPk(courseId);
        if (!course) {
            //req.flash("error", "Course not found");
            return res.redirect(`/courses`);
        }

        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({
            where: {
                userId,
                courseId,
            },
        });

        if (existingEnrollment) {
            //req.flash("error", "User is already enrolled in this course");
            return res.redirect(`/courses`);
        }

        // Enroll the user in the course
        const EducatorId = course.EducatorId;
        await Enrollment.create({
            userId,
            courseId,
            EducatorId,
        });
        //req.flash("success", "Enrolled Successfully!!");
        return res.redirect(`/courses`);
    } catch (error) {
        
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};