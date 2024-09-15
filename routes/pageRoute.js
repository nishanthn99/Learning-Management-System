const express=require('express');
const router=express.Router({mergeParams:true});
const EnsureLogin=require('connect-ensure-login');
const pageController=require('../controllers/page')
const {isEducator,isOwner,isOwnerOrEnrolled}=require('../middleware');

router.get('/createpage',EnsureLogin.ensureLoggedIn(),pageController.getNewPage);
router.get('/',EnsureLogin.ensureLoggedIn(),isOwnerOrEnrolled,pageController.getPages);

router.get("/:PageId",EnsureLogin.ensureLoggedIn(),isOwnerOrEnrolled,pageController.getParticularPage);
router.post('/',EnsureLogin.ensureLoggedIn(),isEducator,isOwner,pageController.postNewPage);
router.get("/:PageId/edit",EnsureLogin.ensureLoggedIn(),pageController.getEditPage);
router.put("/:PageId",EnsureLogin.ensureLoggedIn(),isOwner, pageController.updatePage);
router.delete("/:PageId",EnsureLogin.ensureLoggedIn(),isOwner,pageController.deletePage);
//markAsComplete
router.post("/:pageId", EnsureLogin.ensureLoggedIn(),pageController.markAsComplete);








module.exports=router