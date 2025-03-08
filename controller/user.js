import User from "../model/user.model.js";

// Fetch all users
export const getAllUsers = async (req, res, next) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch a single user by ID
export const getUser = async (req, res, next) => {
  try {
    // Retrieve user by ID, excluding password field for security
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
