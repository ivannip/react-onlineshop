const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//Called upon login
passport.use(new LocalStrategy(User.authenticate()));

//called while after login to set user detail in req.user
passport.serializeUser(User.serializeUser());