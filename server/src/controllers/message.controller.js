import Message from "../models/message.model.js";

export const getMessagesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: User not authenticated",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: user._id, receiver: userId },
        { sender: userId, receiver: user._id }
      ]
    });

    // For production, consider using a logging library like 'winston' or 'morgan' with appropriate log levels.

    res.json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
