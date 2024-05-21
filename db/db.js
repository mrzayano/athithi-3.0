const mongoose = require("mongoose");
require('dotenv').config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const dbName = 'mydbs'; // Replace with your actual database name

async function connectDB() {
    try {
        await mongoose.connect(`mongodb+srv://zayanolakara127:zddO7WoFZ7MBGj8c@cluster0.ygtp0hx.mongodb.net/yourDatabaseName?retryWrites=true&w=majority
        `);
        console.log('MongoDB connected');
    } catch (error) {
        console.error("MongoDB failed to connect", error);
    }
}

connectDB();

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: [String], // Array to store multiple image filenames
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    facilities: {
        type: String,
        required: true
    }
});

const packageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: true
    },
    images: [String],
    location: {
        type: String,
        required: true
    }
});

const Room = mongoose.model("Room", roomSchema);
const Package = mongoose.model("Package", packageSchema);

module.exports = { Room, Package };
