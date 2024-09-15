const {User,Chapter,Course,Enrollment}=require('../models');
const Sequelize = require("sequelize");
module.exports.getNewChapter=(req,res)=>{
    res.render('createchapter',{title:"Create a New Chapter in Learning Management System",_csrf:req.csrfToken(),id:req.params.courseid})
}

module.exports.postNewChapter=async(req,res)=>{
    try{
        const chapter=await Chapter.addChapter(req.body.title,req.body.desc,req.params.courseid);
        res.redirect(`/course/${req.params.courseid}/chapter/${chapter.id}/page`);
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
        let chapter = await Chapter.findAll({ where: { courseId: courseId }, order: [['id']] });

        // Render or respond based on the request format
        if (req.accepts("html")) {
            res.render("showchapter.ejs", { course, chapter, _csrf: req.csrfToken() });
        } else {
            res.json({ chapter });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching chapters.' });
    }
};

