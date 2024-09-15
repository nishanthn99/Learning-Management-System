const express=require('express');
const router=express.Router({mergeParams:true});
const EnsureLogin=require('connect-ensure-login');
const chapterController=require('../controllers/page')
const {isEducator,isOwner}=require('../middleware');

router.get('/createpage',EnsureLogin.ensureLoggedIn(),chapterController.getNewPage);
router.get('/',EnsureLogin.ensureLoggedIn(),chapterController.getPages);
router.post('/',EnsureLogin.ensureLoggedIn(),chapterController.postNewPage);
router.get("/:PageId/edit",connectEnsureLogin.ensureLoggedIn(),pageController.getEditPage);
router.put("/:PageId",connectEnsureLogin.ensureLoggedIn(),isOwner, pageController.updatePage);
router.delete("/:PageId",connectEnsureLogin.ensureLoggedIn(),isOwner,pageController.deletePage);
//markAsComplete
router.post("/:pageId", connectEnsureLogin.ensureLoggedIn(),pageController.markAsComplete);








module.exports=router