"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./infrastructure/database/connection");
const app_1 = require("./presentation/app");
const startServer = async () => {
    try {
        // Connect to database
        const dbConnection = connection_1.DatabaseConnection.getInstance();
        await dbConnection.connect();
        // Create and start the app
        const app = new app_1.App();
        app.listen();
        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received, shutting down gracefully');
            await dbConnection.disconnect();
            process.exit(0);
        });
        process.on('SIGINT', async () => {
            console.log('SIGINT received, shutting down gracefully');
            await dbConnection.disconnect();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map