import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'; 
import User from '../model/user.model.js'; 


const authorize = async (req, res, next) => {
    try {
        let token;

        // Check if the Authorization header exists and starts with 'Bearer '
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // Extract the token from the header
        }

        if (!token) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user in the database based on the userId from the decoded token
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(403).send({ message: 'Not Found' });
        }

        // Attach the user object to the request so it can be accessed in the next middleware/controller
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized user", error: error.message });
    }
};

export default authorize;