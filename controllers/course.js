const {Course}=require('../models');

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