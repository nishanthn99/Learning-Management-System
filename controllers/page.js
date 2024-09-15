const {Course,Chapter,Page}=require('../models');

module.exports.getNewPage=async(req,res)=>{
    try{const coureseid=req.params.courseid;
    const chapter=await Chapter.findAll({where:{
        courseId:coureseid
    }});
    res.render('createpage',{title:"Create a New Page in Learning Management System",_csrf:req.csrfToken(),courseId:req.params.courseid,chapter,});
    }
    catch(err){
        console.log(err);
    }
}

module.exports.postNewPage=async(req,res)=>{
    try{
        const courseid=req.params.courseid;
        await Page.addPage(courseid,req.body.chapterId,req.body.title,req.body.content);
        res.redirect(`/course/${courseid}/chapter`);
    }
    catch(err){
        console.log(err);
    }
}
module.exports.deletePage = async (req, res) => {
    let courseId = req.params.courseid;
    let pageId = req.params.pageid;
    try {
        await Page.destroy({
            where: {
                id: pageId,
            }
        });
        res.redirect(`/course/${courseId}/page`);
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
};
module.exports.markAsComplete = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = req.params.CourseId;
        const pageId = req.params.pageId;
        await Progress.create({ studentId: userId,courseId, pageId, IsComplete: true });
        //req.flash("success", "Great job! Page marked as completed.");
        res.redirect(`/course/${courseId}/page/${pageId}`);
    }
    catch (err) {
        console.log(err);
    }
};
module.exports.updatePage = async (req, res) => {
    let courseId = req.params.courseid;
    let pageId = req.params.pageid;
    try {
        await Page.update({ ...req.body }, {
            where: {
                id: pageId,
            }
        });
        //req.flash("success", "Page Updated Successfully!!");
        res.redirect(`/courses/${courseId}/page`);
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
};

module.exports.getEditPage = async (req, res) => {
    try {
        let courseId = req.params.courseid;
        let chapterId = req.params.chapterid;
        let pageId = req.params.pageid;
        let course = await Course.findByPk(courseId);
        let chapter = await Chapter.findByPk(chapterId);
        let page = await Page.findByPk(pageId);
        res.render("editpage.ejs", { course, chapter, page, csrfToken: req.csrfToken() });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
};