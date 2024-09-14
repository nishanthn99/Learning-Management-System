const express=require('express');
const router=express.Router({mergeParams:true});
const EnsureLogin=require('connect-ensure-login');
const chapterController=require('../controllers/page')
const {isEducator,isOwner}=require('../middleware');

router.get('/',EnsureLogin.ensureLoggedIn(),chapterController.getNewPage);

router.post('/',EnsureLogin.ensureLoggedIn(),chapterController.postNewPage);









module.exports=router