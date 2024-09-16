const express=require('express');
const router=express.Router({mergeParams:true});
const EnsureLogin=require('connect-ensure-login');
const pageController=require('../controllers/page')
const {isEducator,isOwner,isOwnerOrEnrolled}=require('../middleware');

router.get('/createpage',EnsureLogin.ensureLoggedIn(),pageController.getNewPage);
router.get('/',EnsureLogin.ensureLoggedIn(),isOwnerOrEnrolled,pageController.getPages);

router.get("/:pageid",EnsureLogin.ensureLoggedIn(),isOwnerOrEnrolled,pageController.getParticularPage);
router.post('/',EnsureLogin.ensureLoggedIn(),isEducator,isOwner,pageController.postNewPage);
router.get("/:pageid/editpage",EnsureLogin.ensureLoggedIn(),pageController.getEditPage);
router.post("/:pageid/updatepage",EnsureLogin.ensureLoggedIn(),isOwner, pageController.updatePage);
router.delete("/:pageid/deletepage",EnsureLogin.ensureLoggedIn(),isOwner,pageController.deletePage);
//markAsComplete
router.post("/:pageid", EnsureLogin.ensureLoggedIn(),pageController.markAsComplete);








module.exports=router