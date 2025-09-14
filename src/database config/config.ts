import mongoose from "mongoose";

async function Connection(){

    const options = {
        useUnifiedTopology: true as const
    } as const;
    
    try {
        console.log("Trying to connect to Database");

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGODB_URI as string, options as mongoose.ConnectOptions);

        console.log("Successfully connected to Database");

    } catch (error) {
        console.log("Error while connecting to Database");
        console.log((error as Error).message);
    }
}

export default Connection;