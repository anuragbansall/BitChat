import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: User not authenticated",
      });
    }
    
    const currentUserId = req.user._id;
    const users = await User.find({ _id: { $ne: currentUserId } });

    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
