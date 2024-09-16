const {User,Chapter,Course,Enrollment}=require('../models');
const Sequelize = require("sequelize");
module.exports.getNewChapter=(req,res)=>{
    res.render('createchapter',{title:"Create a New Chapter in Learning Management System",_csrf:req.csrfToken(),id:req.params.courseid})
}

module.exports.postNewChapter=async(req,res)=>{
    try{
        const chapter=await Chapter.addChapter(req.body.title,req.body.desc,req.params.courseid);
        res.redirect(`/course/${req.params.courseid}/chapter/${chapter.id}/page/createpage`);
        }
        catch(err){
            console.log(err);
        }
}

module.exports.getAllChapter = async (req, res) => {
    try {
        let userId = req.user.id;
        let courseId = req.params.courseid;

        // Find the course along with its educator and enrollment count
        let course = await Course.findOne({
            where: { id: courseId },
            attributes: [
                'id',
                'coursetitle',
                'educatorId',
                [Sequelize.fn('COUNT', Sequelize.col('Enrollments.id')), 'enrollmentCount']
            ],
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['firstname', 'lastname'],
                    required: true
                },
                {
                    model: Enrollment,
                    attributes: [],
                    required: false
                },
            ],
            group: ['Course.id', 'User.id']
        });

        // Fetch the enrollment status of the user
        res.locals.enrolled = await Enrollment.findAll({ where: { userId, courseId } });

        // Fetch all chapters for the given course
        let chapters = await Chapter.findAll({ where: { courseId: courseId }, order: [['id']] });

        const user=await User.findOne({
            where:{id:req.user.id},
        })

        // Render or respond based on the request format
        if (req.accepts("html")) {
            res.render("showchapter.ejs", {currUser:req.user, user,course, chapters, _csrf: req.csrfToken() ,title:course.coursetitle});
        } else {
            res.json({ chapters });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching chapters.' });
    }
};

module.exports.getEditChapter = async (req, res) => {
    let courseId = req.params.courseid;
    let chapterId = req.params.chapterid;
    try {
        let course = await Course.findByPk(courseId);
        let chapter = await Chapter.findByPk(chapterId);
        res.render("editchapter.ejs", { course, chapter, _csrf: req.csrfToken() });
    } catch (err) {
        console.log(err);
    }
};
module.exports.updateChapter = async (req, res) => {
    let courseId = req.params.courseid;
    let chapterId = req.params.chapterid;
    try {
        await Chapter.update({chaptertitle:req.body.title,description:req.body.desc}, {
            where: {
                id: chapterId,
            }
        });
        //req.flash("success", "Chapter Updated Succesfully!!");
        res.redirect(`/course/${courseId}/chapter`);
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }

};
module.exports.deleteChapter = async (req, res) => {
    let courseId = req.params.courseid;
    let chapterId = req.params.chapterid;
    try {
        await Chapter.destroy({
            where: {
                id: chapterId,
            }
        });
        //req.flash("success", "Chapter Deleted!!");
        res.redirect(`/course/${courseId}/chapter`);
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
};
