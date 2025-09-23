import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
