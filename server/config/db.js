import mongoose from "mongoose";

// function to connect the mongodb database
export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`mongodb database connected successfully`);
  } catch (error) {
    console.error("mongodb connection failed");
    process.exit(1);
  }
};
