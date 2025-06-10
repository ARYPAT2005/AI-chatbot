import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connect to: ${connection.connection.host}`)
    } catch(error) {
        console.log(`Error connecting to database: ${error.message}`)
    }
}