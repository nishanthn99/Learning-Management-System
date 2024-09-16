const {Course,Chapter,Page,Progress}=require('../models');

module.exports.getNewPage=async(req,res)=>{
    try {
    let courseId = req.params.courseid;
    let chapterId = req.params.chapterid;
    let chapter = await Chapter.findByPk(chapterId);
    let chapters = await Chapter.findAll({ where: { courseId }, order: [['id']] });
    res.render('createpage',{title:"Create a New Page in Learning Management System",_csrf:req.csrfToken(),courseId,chapter,chapters});
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
    let chapterId=req.params.chapterid;
    let pageId = req.params.pageid;
    try {
        await Page.destroy({
            where: {
                id: pageId,
            }
        });
        res.redirect(`/course/${courseId}/chapter/${chapterId}/page`);
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
    let chapterId=req.params.chapterid;
    let pageId = req.params.pageid;
    try {
        await Page.update({ ...req.body }, {
            where: {
                id: pageId,
            }
        });
        //req.flash("success", "Page Updated Successfully!!");
        res.redirect(`/course/${courseId}/chapter/${chapterId}/page`);
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
};

module.exports.getPages = async (req, res) => {
    try {
        let userId = req.user.id;
        let courseId = req.params.courseid;
        let chapterId = req.params.chapterid;
        let course = await Course.findByPk(courseId);
        let chapter = await Chapter.findByPk(chapterId);
        const page = await Page.findOne({
            where: {
                chapterId,
            }, limit: 1,
            order: [['id', 'ASC']],
        });
        let pages = await Page.findAll({
            where: {
                chapterId,
            },
            order: [['id','ASC']]
        });
        let nextIndex = (pages.findIndex((p) => p.id === page.id)) + 1;
        if (nextIndex == pages.length) {
            nextIndex = 0;
        }
        const isMarked = await Progress.MarkedAsComplete(userId, page.id);
        if (req.accepts("html")) {
            res.render("showpage.ejs", {currUser:req.user, pages, course, chapter, page, nextIndex, _csrf: req.csrfToken(), isMarked ,title:chapter.chaptertitle});
        } else {
            res.json({ pages, course, chapter, page, nextIndex, _csrf: req.csrfToken(), isMarked });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.getParticularPage = async (req, res) => {
    try {
        let userId = req.user.id;
        let courseId = req.params.courseid;
        let chapterId = req.params.chapterid;
        let PageId = req.params.pageid;
        let course = await Course.findByPk(courseId);
        let chapter = await Chapter.findByPk(chapterId);
        let page = await Page.findOne({ where: { id: PageId } });
        let pages = await Page.findAll({
            where: {
                chapterId,
            },
            order: [['id']]
        });
        let nextIndex = (pages.findIndex((p) => p.id === page.id)) + 1;
        if (nextIndex == pages.length) {
            nextIndex = 0;
        }
        const isMarked = await Progress.MarkedAsComplete(userId, PageId);
        res.render("showpage.ejs", { currUser:req.user,pages, course, chapter, page, nextIndex, _csrf: req.csrfToken(), isMarked ,title:chapter.chaptertitle});
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
        
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
        res.render("editpage.ejs", { course, chapter, page, _csrf: req.csrfToken() });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
};