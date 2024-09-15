const express=require('express');
const router=express.Router({mergeParams:true});
const EnsureLogin=require('connect-ensure-login');
const chapterController=require('../controllers/chapter')
const {isEducator,isOwner}=require('../middleware');

router.get('/createchapter',chapterController.getNewChapter);
router.get('/',chapterController.getAllChapter);
router.post('/',EnsureLogin.ensureLoggedIn(),chapterController.postNewChapter);
router.get("/:chapterid/edit",EnsureLogin.ensureLoggedIn(),chapterController.getEditChapter);
router.put("/:chapterid",EnsureLogin.ensureLoggedIn(),isOwner,chapterController.updateChapter);
router.delete("/:chapterid", EnsureLogin.ensureLoggedIn(),isOwner,chapterController.deleteChapter);

module.exports=router