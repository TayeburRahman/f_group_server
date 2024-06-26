const {
  createUser,
  getUser,
  getAllUser,
  getUsersScannedProducts,
  getLeaderboardUser,
  addFriend,
  getUserFriends,
  removeFriend,
  getUserData,
  getUserFriend,
  getUserDataById,
  getUserFriendData,
  updateUserName,
  updateProfileImage,
  getDiscordUser,
} = require("../controllers/user.controllers");
const upload = require("../middleware/uploadImage");
const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

router.route("/signup").post(createUser);
router.route("/login").post(getUser);

router.route("/discord/callback").get(getDiscordUser);
// router.route("/auth/discord/callback").get(getUser);


router.route("/update/name/:ID").put(updateUserName);
router.route("/getByAllAuthor").get(verifyToken, getAllUser);
router.route("/get_user_scanned_product").get(getUsersScannedProducts);
router.route("/get_leaderboard_user").get(getLeaderboardUser);
router.route("/get_user_friends").post(getUserFriends);
router.route("/remove_friend").post(removeFriend);
router.route("/add_friend").post(addFriend);
router.route("/find/:email").get(getUserData);
router.route("/findbyid/:ID").get(getUserDataById);
router.route("/find/friend/:ID").get(getUserFriendData);
router.route('/update/profile/:email').put(
  upload.single("avatar"), 
  updateProfileImage);  


module.exports = router;
