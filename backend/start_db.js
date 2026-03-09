const { MongoMemoryServer } = require('mongodb-memory-server');

const startDb = async () => {
    try {
        console.log("Starting MongoDB Memory Server on port 27017...");
        const mongoServer = await MongoMemoryServer.create({
            instance: { port: 27017 }
        });

        console.log(`✅ Success! MongoDB is now running locally at: ${mongoServer.getUri()}`);
        console.log("Keep this process running to keep the database alive for the FastAPI backend.");
    } catch (err) {
        console.error("Failed to start MongoDB Memory Server:", err);
        process.exit(1);
    }
};

startDb();
