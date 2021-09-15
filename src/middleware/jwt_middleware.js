const jwt = require("express-jwt");
const secret = require("../../config/jwt").secret;

// get the secret used to sign the JWT token
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.split(" ")[0] === "Bearer") {
    return authHeader.split(" ")[1];
  }
  return null;
};

// get token from cookie
const getTokenFromCookie = (req) => {
  let token = null;
  if (req && req.cookies) token = req.cookies["jwt"];
  return token;
}

module.exports = {
  required: jwt({
    secret: secret,
    algorithms: ['sha1', 'RS256', 'HS256'],  // need to add algorithm properties then only the code can run
    userProperty: "user",
    getToken: getTokenFromCookie
  })
};