const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ msg: "No token provided" });
  }

  console.log("Token received:", token); // Log the received token
  console.log("JWT Secret:", process.env.JWT_SECRET); // Log the JWT secret

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Log decoded token
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token error:", error.message);
    res.status(401).json({ msg: "Invalid token", error: error.message });
  }
};

module.exports = { authenticate };
