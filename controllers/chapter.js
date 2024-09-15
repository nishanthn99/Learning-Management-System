const {Chapter}=require('../models');

module.exports.getNewChapter=(req,res)=>{
    res.render('createchapter',{title:"Create a New Chapter in Learning Management System",_csrf:req.csrfToken(),id:req.params.courseid})
}

module.exports.postNewChapter=async(req,res)=>{
    try{
        await Chapter.addChapter(req.body.title,req.body.desc,req.params.courseid);
        res.redirect(`/course/${req.params.courseid}/page`);
        }
        catch(err){
            console.log(err);
        }
}