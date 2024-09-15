const express=require('express');
const router=express.Router({mergeParams:true});
const EnsureLogin=require('connect-ensure-login');
const chapterController=require('../controllers/page')
const {isEducator,isOwner,isOwnerOrEnrolled}=require('../middleware');

router.get('/createpage',EnsureLogin.ensureLoggedIn(),chapterController.getNewPage);
router.get('/',EnsureLogin.ensureLoggedIn(),isOwnerOrEnrolled,chapterController.getPages);

router.get("/:PageId",connectEnsureLogin.ensureLoggedIn(),isOwnerOrEnrolled,pageController.getParticularPage);
router.post('/',EnsureLogin.ensureLoggedIn(),isEducator,isOwner,chapterController.postNewPage);
router.get("/:PageId/edit",connectEnsureLogin.ensureLoggedIn(),pageController.getEditPage);
router.put("/:PageId",connectEnsureLogin.ensureLoggedIn(),isOwner, pageController.updatePage);
router.delete("/:PageId",connectEnsureLogin.ensureLoggedIn(),isOwner,pageController.deletePage);
//markAsComplete
router.post("/:pageId", connectEnsureLogin.ensureLoggedIn(),pageController.markAsComplete);








module.exports=router