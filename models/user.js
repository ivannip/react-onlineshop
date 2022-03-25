const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Session = new mongoose.Schema({
    refreshToken: {
        type: String,
        default: ""
    }
});

const User = new mongoose.Schema({
    authStrategy: {
        type: String,
        default: "local"
    },
    name: {
        type: String
    },
    mobile: {
        type: Number
    },
    group: {
        type: String,
        default: "customer",
    },
    refreshToken: {
        type: [Session]
    }
});

//Remove Token from response
User.set("toJSON", {
    transform: function(doc, ret, options) {
      delete ret.refreshToken;
      return ret;
    }
  });
  
  User.plugin(passportLocalMongoose);
  
  module.exports = mongoose.model('User', User);
