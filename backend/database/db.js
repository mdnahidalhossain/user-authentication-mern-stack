import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGO-DB connected successfully!")
    } catch (error) {
        console.log("Error connecting to MONGO-DB", error)
        process.exit(1)
    }
}

