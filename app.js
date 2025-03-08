import express from 'express';
import errorMiddleware from './Middleware/error.middleware.js';

import { PORT} from './config/env.js'; 
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscriptions.routes.js';
import connectToDatabase from './database/mongodb.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './Middleware/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRoutes);  // auth routes
app.use('/api/v1/subscriptions', subscriptionRouter); // subsciption routes
app.use('/api/v1/users', userRoutes); // user routes
app.use('/api/v1/workflow', workflowRouter) // workflow routes

app.get('/', (req, res) => {
    res.send("Hello People!");
})

app.use(errorMiddleware); // error middleware

app.listen(PORT, async (req, res) => {
    console.log(`Listening on http://localhost:${PORT}`);
    await connectToDatabase();
})

export default app;