import app from "./app.js";
import mongoose from "mongoose";
import 'dotenv/config'


const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI)
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

connectDB().then(() => {
  console.log("Database connection established");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}).finally(() => {
  console.log("Server setup complete");
});

