import User from '../schema/users.schema.js'; // Adjust the import path as needed
import success from '../helper/res.success.js'; // For success responses
import error from '../helper/res.error.js'; // For error responses
import biddingGroundSchema from "../schema/bidding.schema.js"
import { sendMail } from '../helper/sendMail.js';


// Create a new user
const createUser = async (req, res) => {
    try {
        const { name, phone, email, imageUrl, password, role } = req.body;

        if (!name || !phone || !email || !password || !role) {
            return error.BadRequest(res, 'All fields are required.');
        }
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return error.BadRequest(res, 'User already exist.');
        }

        const newUser = new User({
            name,
            phone,
            email,
            imageUrl,
            password, // In a real application, hash the password before saving
            role,
        });

        await newUser.save();

        // Send success response
        return success.successResponse(res, newUser, 'User created successfully.');
    } catch (err) {
        // Send internal server error
        return error.InternalServerError(res, err.message);
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return success.successResponse(res, users, 'Users retrieved successfully.');
    } catch (err) {
        return error.InternalServerError(res, err.message);
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return error.BadRequest(res, 'User not found.');
        }
        return success.successResponse(res, user, 'User retrieved successfully.');
    } catch (err) {
        return error.InternalServerError(res, err.message);
    }
};

// Update user by ID
const updateUserById = async (req, res) => {
    try {
        const { status } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return error.BadRequest(res, 'User not found.');
        }

        // Respond with the updated user info
        success.successResponse(res, updatedUser, 'User updated successfully.');

        // Define dynamic email content with colors, images, and user name
        const acceptedTemplate = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                    <h1>Congratulations, ${updatedUser.name}!</h1>
                </div>
                <div style="padding: 20px;">
                    <p>We are excited to inform you that your application has been accepted.</p>
                    <p>We look forward to working with you!</p>
                    <img src="https://via.placeholder.com/600x200?text=Accepted" alt="Accepted" style="width: 100%; height: auto; border-radius: 8px;">
                </div>
                <div style="background-color: #f1f1f1; padding: 10px; text-align: center;">
                    <p style="font-size: 14px;">If you have any questions, feel free to reach out to us.</p>
                </div>
            </div>
        `;
        
        const rejectedTemplate = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <div style="background-color: #FF5733; color: white; padding: 20px; text-align: center;">
                    <h1>Sorry, ${updatedUser.name}!</h1>
                </div>
                <div style="padding: 20px;">
                    <p>We're sorry to inform you that your application has been rejected.</p>
                    <p>We appreciate your effort and encourage you to apply again in the future.</p>
                    <img src="https://via.placeholder.com/600x200?text=Rejected" alt="Rejected" style="width: 100%; height: auto; border-radius: 8px;">
                </div>
                <div style="background-color: #f1f1f1; padding: 10px; text-align: center;">
                    <p style="font-size: 14px;">If you have any questions, feel free to reach out to us.</p>
                </div>
            </div>
        `;

        // Send the email based on the updated status
        if (status === "accepted") {
            await sendMail(updatedUser.email, acceptedTemplate);
        } else {
            await sendMail(updatedUser.email, rejectedTemplate);
        }

        return;
    } catch (err) {
        return error.InternalServerError(res, err.message);
    }
};
    

// Delete user by ID
const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return error.BadRequest(res, 'User not found.');
        }

        return success.successResponse(res, deletedUser, 'User deleted successfully.');
    } catch (err) {
        return error.InternalServerError(res, err.message);
    }
};

const loginUser = async (req, res) => {
    //Login user
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return error.BadRequest(res, 'Email and password are required.');
        }
        const user = await User.findOne({ email });
        if (!user) {
            return error.BadRequest(res, 'User not found.');
        }
        //Check if password is correct
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return error.BadRequest(res, 'Invalid credentials.');
        }
        // //Send token
        const token = user.getSignedJwtToken();
        return success.successResponse(res, { token }, 'User logged in successfully.');
    } catch (error) {

    }
}

const getProfile=async(req,res)=>{
    
const {_id}=req.user;
    try{
        const users=await User.findOne({_id}).select('-password');
        return success.successResponse(res,users,'Users retrieved successfully');
    }catch(error){
        return error.InternalServerError(res,error.message);
    }
}
const pruchasedPlayer = async (req, res) => {
    try {
        // Fetch all purchased players for the current user
        const purchasedPlayers = await biddingGroundSchema
            .find({ soldTo: req.user._id })
            .populate('playerId') // Populating the player details
            .lean(); // Converting the Mongoose documents to plain JavaScript objects

        // Map through the results to include the player details and the price (last bid)
        const response = purchasedPlayers.map(player => {
            const lastBid = player.bids[player.bids.length - 1]; // Get the last bid
            return {
                playerDetails: player.playerId, // Populated player details
                price: lastBid ? lastBid.bidAmount : null, // Price from the last bid
                status: player.status,
                soldAt: player.updatedAt
            };
        });

        return success.successResponse(res, response, 'Purchased players retrieved successfully.');
    } catch (err) {
        return error.InternalServerError(res, err.message);
    }
};

export { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, loginUser,getProfile ,pruchasedPlayer};
