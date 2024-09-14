const {Chapter,Page}=require('../models');

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
        const coureseid=req.params.courseid;
        await Page.addPage(coureseid,req.body.title,req.body.content);
        res.redirect('/dashboard-edu');
    }
    catch(err){
        console.log(err);
    }
}