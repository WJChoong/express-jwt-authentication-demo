const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret } = require("../../config/jwt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    lowercase: true,
    required: [true, "cannot be blank"],
    unique: true
  },
  email: {
    type: String,
    index: true,
    lowercase: true,
    required: [true, "cannot be blank"],
    unique: true
  },
  passwordHash: String,
  passwordSalt: String
});

// set password
UserSchema.methods.setPassword = function(password) {
  this.passwordSalt = generateSalt();
  this.passwordHash = hashPassword(password, this.passwordSalt);
};

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
}

// verify password
UserSchema.methods.validPassword = function(password) {
  return this.passwordHash === hashPassword(password, this.passwordSalt);
};

UserSchema.plugin(uniqueValidator, { message: "should be unique" });

UserSchema.methods.generateJWT = function(){
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      userid: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

UserSchema.methods.verifyJWT = function(token) {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = mongoose.model("User", UserSchema);
