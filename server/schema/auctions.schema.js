import mongoose from "mongoose";

const AuctionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        auctionDate: {
            type: Date,
            required: true,

        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending'
        },
        roomId:{
          
            type: mongoose.Schema.Types.ObjectId,
            ref: 'auction' ,// Assuming Room is a model defined elsewhere
            required: true
        }


    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    }
);

const AuctionModel = mongoose.model("auction", AuctionSchema);
export default AuctionModel;
