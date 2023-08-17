import app from "../app.js";
import { connectDB, client } from "../services/db/connect.js";

const port = 8080;

(async () => {
  await connectDB();
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${port}`);
  });

  const gracefulShutdown = async () => {
    try {
      await server.close();
      await client.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
      process.exit(1);
    }
  };

  // Listen for the server shutdown event
  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
})();
