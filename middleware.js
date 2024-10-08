
const { Course,Enrollment } = require('./models');

module.exports.isEducator = (req, res, next) => {
    // Check if user is logged in and has the role of Educator
    if (req.user && req.user.role === 'Educator') {
        // User is an Educator, proceed to the next middleware/route handler
        next();
    } else {
        // User is not an Educator, return an error response
       return res.status(403).json({ error: 'Access denied. You are not authorized as an Educator.' });
       
    }
};
module.exports.isOwner = async (req, res, next) => {
    try {
        // Get the courseId from the request parameters
        const { courseid } = req.params;

        // Find the course by courseId
        const course = await Course.findByPk(courseid);

        // Check if the course exists
        if (!course) {
             res.status(404).json({ error: 'Course not found' });
        }

        // Check if the logged-in user is the owner of the course
        if (req.user && course.educatorId === req.user.id) {
            // User is the owner, proceed to the next middleware/route handler
           return next();
        } else {
            // User is not the owner, return an error response
            return res.status(403).json({ error: 'Access denied. You are not authorized to manage this course.' });
        }
    } catch (error) {
        console.error('Error in isOwner middleware:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
};
module.exports.isOwnerOrEnrolled = async (req, res, next) => {
    try {
        // Get the courseId from the request parameters
        const { courseid } = req.params;

        // Get the userId from the authenticated user
        const userId = req.user.id;

        // Check if the user is the owner of the course
        const course = await Course.findByPk(courseid);

        // Check if the course exists
        if (!course) {
             res.status(404).json({ error: 'Course not found' });
        }

        // Check if the logged-in user is the owner of the course
        if (req.user && course.educatorId === req.user.id) {
            // User is the owner, proceed to the next middleware/route handler
            return next();
        } else {
            // User is not the owner, check if the user is enrolled in the course
            const enrollment = await Enrollment.findOne({
                where: {
                    userId,
                    courseId:courseid
                },
            });

            if (enrollment) {
                // User is enrolled, proceed to the route handler
                return next();
            } else {
                // User is not the owner and not enrolled, return an error response
                res.status(403).json({ error: 'Access denied. You are not authorized to this course.' });
            }
        }
    } catch (error) {
        console.error('Error in isOwnerOrEnrolled middleware:', error);
         res.status(500).json({ error: 'Internal Server Error' });
    }
};
