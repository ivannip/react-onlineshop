const User = require("../models/user");
const { getToken, COOKIE_OPTIONS, getRefreshToken} = require("../authenticate");
//const jwt = require("jsonwebtoken");
const logger = require("../logger");

// exports.userRegistration = async ({username,name, mobile, address, group, password}) => {
//   const newUser = new User({username,name, mobile, address, group});
//   try {
//       const _user = await User.register(newUser, password);
//       const refreshToken = getRefreshToken({_id: _user._id});
//       user.refreshToken.push({refreshToken});
//       const savedUser = await _user.save();
//       return savedUser;                         
//   } catch (err) {
//       throw err;
//   }
// }

exports.userRegistration = (req, res, next) => {
    
    const newUser = new User({username: req.body.username, name: req.body.name, mobile: req.body.mobile, address: req.body.address, group: req.body.group});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            logger.error(err);
            res.send(err);
        } else {
            const token = getToken({_id: user._id});
            const refreshToken = getRefreshToken({_id: user._id});
            user.refreshToken.push({refreshToken});
            user.save((err, savedUser) => {
                if (err) {
                    res.statusCode = 500;
                    logger.error(err);
                    res.send(err)
                } else {
                    const userId = savedUser._id;
                    const userInfo = {name: savedUser.name, mobile: savedUser.mobile, group: savedUser.group, address: savedUser.address};                 
                    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                    logger.debug({success: true, token, userId, userInfo: userInfo});
                    res.send({success: true, token, userId, userInfo: userInfo});
                }
            })
        }
    })
}

exports.userLogin = async ({_id}) => {
  const userId = _id;
  try {
    const token = getToken({_id: userId});
    const refreshToken = getRefreshToken({_id: userId});
    const _user = await User.findById(userId);
    _user.refreshToken.push({refreshToken});
    savedUser = await _user.save();
    //logger.debug({savedUser, token, refreshToken})
    return {savedUser, token, refreshToken};
  } catch (err) {
    throw err
  }
}

exports.getUserInfo = async ({_id}) => {
    try {
      const foundUser = await User.findById(_id);
      return foundUser;
    } catch (err) {
      throw err;
    }
}

exports.userLogout = async ({_id, refreshToken}) => {
    try {
        const _user = await User.findById(_id);
        const tokenIndex = _user.refreshToken.findIndex(
          item => item.refreshToken === refreshToken
        );
        if (tokenIndex !== -1) {
          _user.refreshToken.id(_user.refreshToken[tokenIndex]._id).remove();
        }
        const savedUser = await _user.save();
        return savedUser;
    } catch (err) {
      throw err;
    }    
}

exports.renewToken = async ({_id, refreshToken}) => {   
      try {
        //const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userId = _id
        const _user = await User.findOne({ _id: userId});
        if (_user) {
            // Find the refresh token against the user record in database
            const tokenIndex = _user.refreshToken.findIndex(
              item => item.refreshToken === refreshToken
            )
            if (tokenIndex === -1) {
              throw new Error("Unauthorized");
            } else {
                const token = getToken({ _id: userId })
                // If the refresh token exists, then create new one and replace it.
                const newRefreshToken = getRefreshToken({ _id: userId })
                _user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
                const savedUser = await _user.save();
                return {savedUser, token, newRefreshToken}           
            }
        } else {
          throw new Error("Unauthorized");
        }        
      } catch (err) {
        throw err;
      }   
  }