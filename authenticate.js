const passport = require("passport");
const jwt = require("jsonwebtoken");
const dev = process.env.NODE_ENV !== "production";

exports.COOKIE_OPTIONS = {
    httpOnly: true,
    // Since localhost is not having https protocol,
    // secure cookies do not work correctly (in postman)
    //Cross site cookie -- samSite: none was disable due to non-https
    //Somehow samsite: none is not work for refreshtoken and logout. It works after change to LAX
    secure: !dev,
    signed: true,
    maxAge: 2592000*1000,
    sameSite: "Lax",
  }
  //sign-in with payload, key, options
  exports.getToken = user => {
    return jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: eval(process.env.SESSION_EXPIRY),
    })
  }
  
  exports.getRefreshToken = user => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
    })
  }
  
  exports.verifyUser = passport.authenticate("jwt", { session: false })
  