const jwt = require("jsonwebtoken");

const generateAccessToken = (id, userName, role) => {
  const token = jwt.sign({ id, userName, role }, process.env.SECRET_TOKEN);

  return { token };
};

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const checkAdminRole = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    if (decoded.role !== "Admin")
      return res.status(401).send("Invalid account role");
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = {
  verifyToken,
  generateAccessToken,
  checkAdminRole,
};
