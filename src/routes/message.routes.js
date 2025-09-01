import express from "express";
import { getMessagesByUserId } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/:userId", getMessagesByUserId);

export default messageRouter;
