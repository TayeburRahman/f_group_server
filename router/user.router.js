const {
  createUser,
  getUser,
  getAllUser,
  getUserData,
  getUserDataById,
  getDiscordUser,
} = require("../controllers/user.controllers");
const upload = require("../middleware/uploadImage");
const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

router.route("/signup").post(createUser);
router.route("/login").post(getUser);

router.route("/discord/callback").get(getDiscordUser);
// router.route("/auth/discord/callback").get(getUser); 
router.route("/getByAllAuthor").get(verifyToken, getAllUser); 
router.route("/find/:email").get(getUserData);
router.route("/findbyid/:ID").get(getUserDataById);  


module.exports = router;
