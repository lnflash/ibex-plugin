"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("@ibex/app/router"));
const knex_1 = require("@ibex/knex");
(async () => {
    try {
        dotenv_1.default.config();
        // Connect to the database
        // await setupDatabase();
        // Set up middleware
        app.use(express_1.default.json());
        // Import and use the main router
        app.use("/api/v1", router_1.default);
        // Start the server
        const port = process.env.PORT || 4000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Error setting up the database:", error);
    }
})();
process.on("SIGINT", async () => {
    try {
        await (0, knex_1.closeDatabase)();
        console.log("Database connection closed.");
        process.exit(0);
    }
    catch (error) {
        console.error("Error closing the database connection:", error);
        process.exit(1);
    }
});
exports.default = app;
//# sourceMappingURL=index.js.map