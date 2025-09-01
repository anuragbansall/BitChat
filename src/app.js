import express from "express";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/api", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to the API",
  });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
});

export default app;
