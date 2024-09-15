const express=require('express');
const router=express.Router({mergeParams:true});
const EnsureLogin=require('connect-ensure-login');
const chapterController=require('../controllers/chapter')
const {isEducator,isOwner}=require('../middleware');

router.get('/createchapter',chapterController.getNewChapter);
router.get('/',chapterController.getAllChapter);
router.post('/',EnsureLogin.ensureLoggedIn(),chapterController.postNewChapter);

module.exports=router