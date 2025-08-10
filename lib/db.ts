import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number; // isConnected is optional, as it may not get back always, here we will store the db readyState, that's why we are defining type for type safety
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> { 
    // import thing, in other languages void return type means it does not return anything, but in Js it means does not care about return type and what's coming back

    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "");

        // console.log("db console log", db);

        connection.isConnected = db.connections[0].readyState; 
        // readyState is a number that indicates the connection state:
        // 0 means disconnected, 1 means connected, 2 means connecting, and 3 means disconnecting

        console.log("Connected to the database", connection.isConnected);
    
    } catch (error) {
        console.error("Error connecting to the database:", error); 
        process.exit(1);  // exit the process with a failure code
    }
}

export default dbConnect; 
// export the dbConnect function so it can be used in other files
