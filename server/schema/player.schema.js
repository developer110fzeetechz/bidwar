import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{10}$/, // Ensures a 10-digit phone number
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // Valid email format
    },
    imageUrl: {
        type: String,
        trim: true,
        default: '', // Optional field
    },
    playerType: {
        type: String,
        required: true,
        enum: ['batter', 'bowler', 'allrounder'], // Restricts values
    },
    battingDetails: {
        handedness: {
            type: String,
            enum: ['right-hand', 'left-hand'], // Right-hand or Left-hand
        },
        isWicketkeeper: {
            type: Boolean,

        },
    },
    bowlingDetails: {
        type: {
            type: String,
            enum: ['spin', 'fast'], // Spin or Fast
        },
        arm: {
            type: String,
            enum: ['right-arm', 'left-arm'], // Right-arm or Left-arm
        },
    },
    basePrice: {
        type: Number,
        required: true,
        min: 1000,
    },
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

export default Player;
