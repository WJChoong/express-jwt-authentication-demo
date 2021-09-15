const User = require("../model/user");
const status = require("http-status");

const registerNewUser = async (req, res) => {
  var user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  await user.save();
  return res.json({ user: { username: user.username, email: user.email } });
}

const login = async (req, res) => {
  const email = req.body.user.email;
  const password = req.body.user.password;

  // check usernmae and password
  let user = await User.findOne({email: email});
  if(!user || !user.validPassword(password)) {
    return res.status(status.UNAUTHORIZED).json({
      error:{
        message: "email or password is invalid"
      }
    });
  }

  // send token via res.cookie()
  const token = user.generateJWT();
  // TODO: we should also set "secure" option to true in the cookie, if our service supports HTTPS
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: true
  });

  return res.json({
    user: { username: user.username, email: user.email }
  });
}

const changePassword = async(req, res) => {
  // req.user is set by express-jwt middleware after succeessful pass the JWT validation
  const userId = req.user.userid;
  const user = await User.findById(userId);

  const newUserProfile = req.body.user;
  if (newUserProfile.password) {
    user.setPassword(newUserProfile.password);
  }
  await user.save();
  return res.json({
    status: "done"
  });
}

const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.json({ status: "done" });
}

module.exports = {
  registerNewUser,
  login,
  logout,
  changePassword
};