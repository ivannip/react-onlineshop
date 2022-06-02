const express = require("express");
const { userRegistration, userLogin, getUserInfo, userLogout, renewToken } = require("../controls/userControl");
const router = express.Router();
const passport = require("passport");
const {verifyUser} = require("../authenticate")

const setupProxy = require("./setupProxy");

//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use(setupProxy);
//console.log(getToken);

router.post("/register", userRegistration);

router.post("/login", passport.authenticate("local"), userLogin);

router.get("/loginInfo", verifyUser, getUserInfo);

router.get("/logout", verifyUser, userLogout)

router.post("/refreshToken", renewToken)

module.exports = router;