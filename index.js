import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/connectDB.js";

const PORT = config.port;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await connectDB();
});
