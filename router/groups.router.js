const { createGroup, joinGroup, leaveGroup, kickUser, deleteGroup, getGroups, getGroupById, getGroupsByUserId, updateGroup, acceptJoinRequest, cancelJoinRequest } = require("../controllers/groups.controllers");
 
const upload = require("../middleware/uploadImage"); 

const router = require("express").Router();

router.route('/creates').put(createGroup);  

router.route('/update/:ID').put(updateGroup);  

router.route('/find').get(getGroups);
router.route('/find/:ID').get(getGroupById);
router.route('/user/:ID').get(getGroupsByUserId);
router.route('/join/:ID').put(joinGroup); 
router.route('/accept/:ID').put(acceptJoinRequest); 
router.route('/cancel/:ID').put(cancelJoinRequest); 
router.route('/leave/:ID').put(leaveGroup);
router.route('/kick/:ID').put(kickUser);
router.route('/delete/:ID').put(deleteGroup);

 
// router.route('/getByAllAuthor').get(verifyToken,getAllUser);

module.exports = router;