import User from '../schema/users.schema.js'; // Adjust the import path as needed
import success from '../helper/res.success.js'; // For success responses
import error from '../helper/res.error.js'; // For error responses


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
        const { name, phone, email, imageUrl, password, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, phone, email, imageUrl, password, role },
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return error.BadRequest(res, 'User not found.');
        }

        return success.successResponse(res, updatedUser, 'User updated successfully.');
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

export { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, loginUser,getProfile };
