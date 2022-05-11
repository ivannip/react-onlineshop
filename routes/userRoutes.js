const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require("../authenticate");
const jwt = require("jsonwebtoken");

//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    next();
  });

router.post("/register", (req, res, next) => {
    
    const newUser = new User({username: req.body.username, name: req.body.name, mobile: req.body.mobile, address: req.body.address, group: req.body.group});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.send(err);
        } else {
            const token = getToken({_id: user._id});
            const refreshToken = getRefreshToken({_id: user._id});
            user.refreshToken.push({refreshToken});
            user.save((err, savedUser) => {
                if (err) {
                    res.statusCode = 500;
                    res.send(err)
                } else {
                    const userId = savedUser._id;
                    const userInfo = {name: savedUser.name, mobile: savedUser.mobile, group: savedUser.group, address: savedUser.address};                 
                    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                    res.send({success: true, token, userId, userInfo: userInfo});
                }
            })
        }
    })
})

router.post("/login", passport.authenticate("local"), (req, res, next) => {
    const userId = req.user._id;
    const token = getToken({_id: userId});
    const refreshToken = getRefreshToken({_id: userId});
    User.findById(userId, (err, user) => {
        if (err) {
            next(err);
        } else {
            user.refreshToken.push({refreshToken});
            user.save((err, savedUser) => {
                if (err) {
                    res.statusCode = 500;
                    res.send(err);
                } else {
                    const userInfo = {name: savedUser.name, mobile: savedUser.mobile, group: savedUser.group, address: savedUser.address};
                    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                    res.send({success: true, token, userId, userInfo: userInfo});
                }
            })
        }
    })
})

router.get("/loginInfo", verifyUser, (req,res) => {
  User.findById(req.user._id, (err, foundUser) => {
    !err?res.send(foundUser):res.send(err);
  })
});

router.get("/logout", verifyUser, (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    User.findById(req.user._id, (err, user) => {
        if (err) {
            next(err);
        } else {
            const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
            );
            if (tokenIndex !== -1) {
                user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
            }
            user.save((err, savedUser) => {
                if (err) {
                    res.statusCode = 500;
                    res.send(err);
                } else {
                    res.clearCookie("refreshToken", COOKIE_OPTIONS);
                    res.send({success: true});
                }
            });
        };
    });
})

router.post("/refreshToken", (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies
  
    if (refreshToken) {
      try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userId = payload._id
        User.findOne({ _id: userId }).then(
          user => {
            if (user) {
              // Find the refresh token against the user record in database
              const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
              )
  
              if (tokenIndex === -1) {
                res.statusCode = 401
                res.send("Unauthorized")
              } else {
                const userInfo = {name: user.name, mobile: user.mobile, group: user.group, address: user.address};
                const token = getToken({ _id: userId })
                // If the refresh token exists, then create new one and replace it.
                const newRefreshToken = getRefreshToken({ _id: userId })
                user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
                user.save((err, user) => {
                  if (err) {
                    res.statusCode = 500
                    res.send(err)
                  } else {
                    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                    res.send({ success: true, token, userId, userInfo: userInfo })
                  }
                })
              }
            } else {
              res.statusCode = 401
              res.send("Unauthorized")
            }
          },
          err => next(err)
        )
      } catch (err) {
        res.statusCode = 401
        res.send("Unauthorized")
      }
    } else {
      res.statusCode = 401
      res.send("Unauthorized")
    }
  })

module.exports = router;