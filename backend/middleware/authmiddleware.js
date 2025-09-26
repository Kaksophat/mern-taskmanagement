const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const adminonly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, adminonly };
