import User from '../model/user.model.js'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

//signup function
export const Signup = async (req, res, next) => {
    const session = await mongoose.startSession(); // Start a new MongoDB session for transaction
    session.startTransaction(); // Begin transaction

    try {
        // Extract user details from request body
        const { name, email, password } = req.body;

        // Check if the user already exists in the database
        const userExist = await User.findOne({ email }).lean();

        if (userExist) {
            const error = new Error('User already exists');
            error.statusCode = 409; // Conflict error
            throw error;
        }

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        // Create a new user inside the transaction
        const newUser = await User.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        // Generate JWT token for authentication
        const token = jwt.sign(
            { userId: newUser[0]._id }, 
            JWT_SECRET, 
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Commit the transaction if everything is successful
        await session.commitTransaction();
        session.endSession();

        // Respond with success message and exclude the password from response
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUser[0]
            }
        });

    } catch (error) {
        await session.abortTransaction(); // Rollback transaction on error
        session.endSession();
        next(error); // Ensure `next` is passed in parameters to handle errors properly
    }
};

//signin function
export const Signin = async (req, res, next) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Check if the user exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            // If no user is found, throw an error
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // If password doesn't match, throw an error
            const error = new Error('Invalid password');
            error.statusCode = 403; // Forbidden
            throw error;
        }

        // Generate a JWT token for authentication
        const token = jwt.sign(
            { userId: user._id },  // Payload: user ID
            JWT_SECRET,            
            { expiresIn: JWT_EXPIRES_IN } 
        );

        // Send response with success message and user data (excluding password)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,  // Authentication token
                user    // User details
            }
        });

    } catch (error) {
        // Pass errors to the error-handling middleware
        next(error);
    }
};

//logout function
export const Logout = (req, res, next) => {

} 