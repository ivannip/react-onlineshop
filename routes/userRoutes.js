const express = require("express");
const { userRegistration, userLogin, getUserInfo, userLogout, renewToken } = require("../controls/userService");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {verifyUser, COOKIE_OPTIONS} = require("../authenticate")

const setupProxy = require("./setupProxy");
const logger = require("../logger");

//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use(setupProxy);
//console.log(getToken);

router.post("/register", userRegistration);

router.post("/login", passport.authenticate("local"), async (req, res, next) => {
    const userId = req.user._id;
    try {
        const {savedUser, token, refreshToken}  = await userLogin({_id: req.user._id})
        const userInfo = {name: savedUser.name, mobile: savedUser.mobile, group: savedUser.group, address: savedUser.address};
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        logger.debug({success: true, token, userId, userInfo: userInfo})
        res.send({success: true, token, userId, userInfo: userInfo});
    } catch (err) {
        console.log(err);
        logger.error(err);
        res.statusCode = 500;
        res.send(err);
    }
  });

// router.post("/login", passport.authenticate("local"), (req, res, next) => {
//     const userId = req.user._id;
//     const token = getToken({_id: userId});
//     const refreshToken = getRefreshToken({_id: userId});
//     User.findById(userId, (err, user) => {
//         if (err) {
//             next(err);
//         } else {
//             user.refreshToken.push({refreshToken});
//             user.save((err, savedUser) => {
//                 if (err) {
//                     res.statusCode = 500;
//                     res.send(err);
//                 } else {
//                     const userInfo = {name: savedUser.name, mobile: savedUser.mobile, group: savedUser.group, address: savedUser.address};
//                     res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
//                     res.send({success: true, token, userId, userInfo: userInfo});
//                 }
//             })
//         }
//     })
// })

router.get("/loginInfo", verifyUser, async (req,res) => {
    try {
        const foundUser = await getUserInfo({_id: req.user.id});
        res.send(foundUser);
    } catch (err) {
        logger.error(err);
        res.statusCode = 500;
        res.send(err);
    }
});

router.get("/logout", verifyUser, async (req, res) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    try {
        await userLogout({_id: req.user._id, refreshToken})
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        res.send({success: true});
    } catch (err) {
        console.log(err);
        logger.error(err);
        res.statusCode = 500;
        res.send(err);
    }    
})

// router.get("/logout", verifyUser, (req, res, next) => {
//     const { signedCookies = {} } = req;
//     const { refreshToken } = signedCookies;
//     User.findById(req.user._id, (err, user) => {
//         if (err) {
//             logger.error(err);
//             next(err);
//         } else {
//             const tokenIndex = user.refreshToken.findIndex(
//                 item => item.refreshToken === refreshToken
//             );
//             if (tokenIndex !== -1) {
//                 user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
//             }
//             user.save((err, savedUser) => {
//                 if (err) {
//                     logger.error(err);
//                     res.statusCode = 500;
//                     res.send(err);
//                 } else {
//                     res.clearCookie("refreshToken", COOKIE_OPTIONS);
//                     res.send({success: true});
//                 }
//             });
//         };
//     });
// })

router.post("/refreshToken", async (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies
    
    if (refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const {savedUser, token, newRefreshToken} = await renewToken({_id: payload._id, refreshToken});
            const userInfo = {name: savedUser.name, mobile: savedUser.mobile, group: savedUser.group, address: savedUser.address};
            logger.debug({savedUser, token, newRefreshToken});
            res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
            res.send({ success: true, token, userId: savedUser._id, userInfo: userInfo });
        } catch (err) {
            if (err == "Unauthorized") {
                console.log(err);
                logger.error(err);
                res.statusCode = 401
                res.send("Unauthorized")
            } else {
                console.log(err);
                logger.error(err);
                res.statusCode = 500
                res.send(err)
            }
        }  
    } else {
      res.statusCode = 401
      res.send("Unauthorized")
    }
  })

// router.post("/refreshToken", (req, res, next) => {
//     const { signedCookies = {} } = req
//     const { refreshToken } = signedCookies
  
//     if (refreshToken) {
//       try {
//         const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
//         const userId = payload._id
//         User.findOne({ _id: userId }).then(
//           user => {
//             if (user) {
//               // Find the refresh token against the user record in database
//               const tokenIndex = user.refreshToken.findIndex(
//                 item => item.refreshToken === refreshToken
//               )
  
//               if (tokenIndex === -1) {
//                 res.statusCode = 401
//                 res.send("Unauthorized")
//               } else {
//                 const userInfo = {name: user.name, mobile: user.mobile, group: user.group, address: user.address};
//                 const token = getToken({ _id: userId })
//                 // If the refresh token exists, then create new one and replace it.
//                 const newRefreshToken = getRefreshToken({ _id: userId })
//                 user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
//                 user.save((err, user) => {
//                   if (err) {
//                     logger.error(err);
//                     res.statusCode = 500
//                     res.send(err)
//                   } else {
//                     res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
//                     res.send({ success: true, token, userId, userInfo: userInfo })
//                   }
//                 })
//               }
//             } else {
//               res.statusCode = 401
//               res.send("Unauthorized")
//             }
//           },
//           err => next(err)
//         )
//       } catch (err) {
//         res.statusCode = 401
//         res.send("Unauthorized")
//       }
//     } else {
//       res.statusCode = 401
//       res.send("Unauthorized")
//     }
//   })

module.exports = router;