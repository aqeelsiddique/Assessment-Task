const express = require('express');

const {registerUser, loginUser, logout, forgetpassword, resetpassword, getUserDeatils, updatepassword, updateprofile, getallusers, getsingleuser, updateprofilerole, deleteuser, deleteUser} = require('../Controllers/usercontroller');
const { isAuthenticatedUser, authorizeroles } = require('../middleware/auth');

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgetpassword)
router.route("/password/reset/:token").put(resetpassword)
router.route("/logout").get(logout);
router.route("/admin/user/:id").delete( isAuthenticatedUser , deleteUser)

/////////////////////for only admin
router.route("/me").get( isAuthenticatedUser ,getUserDeatils)
router.route("/password/update").put(isAuthenticatedUser, updatepassword)
router.route("/me/update").put(isAuthenticatedUser, updateprofile)
router.route("/admin/allusers").get(isAuthenticatedUser, authorizeroles("admin"), getallusers)
router.route("/admin/singleuserdetails/:id").get(isAuthenticatedUser, authorizeroles("admin"), getsingleuser).put(isAuthenticatedUser, authorizeroles("admin"), updateprofilerole).delete(isAuthenticatedUser, authorizeroles("admin"), deleteuser);

module.exports = router
