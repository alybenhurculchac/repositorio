const jwt = require("jsonwebtoken");
const config = require("../config/config");


const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
  console.log(req.body)


  if (!token) {
    return res.status(403).send("Necesita autorización para esta ruta");
  }
  try {
    const decoded = jwt.verify(token, config.llave);
   // req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;