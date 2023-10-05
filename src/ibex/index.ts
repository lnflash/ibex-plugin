import express from "express";
const app = express();
const router = express.Router();
import dotenv from "dotenv";
import routes from "@ibex/app/router";
import { closeDatabase, setupDatabase } from "@ibex/knex";

(async () => {
  try {
    dotenv.config();

    // Connect to the database
    // await setupDatabase();

    // Set up middleware
    app.use(express.json());

    // Import and use the main router
    app.use("/api/v1", routes);

    // Start the server
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error setting up the database:", error);
  }
})();
process.on("SIGINT", async () => {
  try {
    await closeDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing the database connection:", error);
    process.exit(1);
  }
});

export default app;
