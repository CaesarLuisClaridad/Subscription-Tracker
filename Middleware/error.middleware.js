const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err }; // Copy error object to prevent modifications to the original

    error.message = err.message || "Internal Server Error";

    console.log(error); 

    // Mongoose bad ObjectId error (CastError)
    if (err.name === "CastError") {
      error = new Error("Resource not found");
      error.statusCode = 404;
    }

    // Mongoose duplicate key error (E11000)
    if (err.code === 11000) {
      error = new Error("Duplicate field value entered");
      error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map(val => val.message).join(", ");
      error = new Error(message);
      error.statusCode = 400;
    }

    // Send error response
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });

  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

export default errorMiddleware;
