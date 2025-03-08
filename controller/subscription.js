import Subscription from "../model/subscription.model.js";
import { workFlowClient } from "../config/upstash.js";

// Get all subscriptions
export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json({ 
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

// Create a new subscription  
export const createSubscription = async (req, res, next) => {
    try {
        // Create a subscription in the database using the request body and associate it with the authenticated user  
        const subscription = await Subscription.create({
            ...req.body, // Spread the request body to include all subscription details
            user: req.user._id, // Assign the user ID from the authenticated request
        });

        // Ensure that the SERVER_URL environment variable is set  
        if (!process.env.SERVER_URL) {
            throw new Error("SERVER_URL is not defined");
        }

        // Trigger a workflow for subscription reminders  
        const { workflowRunId } = await workFlowClient.trigger({
            url: `${process.env.SERVER_URL}/api/v1/workflow/subscription/reminder`, // Endpoint for triggering the workflow
            body: { subscriptionId: subscription.id }, // Pass the subscription ID in the request body
            headers: { 'Content-Type': 'application/json' }, // Set request headers
            retries: 0, // No retry attempts in case of failure
        });

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (error) { 
        next(error);
    }
};

// Get a user's subscription
export const getUserSubscription = async (req, res, next) => {
    try {
        if (String(req.user.id) !== String(req.params.id)) {  // ✅ Convert both to strings
            const error = new Error("You are not the owner of this subscription");
            error.status = 401;
            throw error;
        }

        const subscription = await Subscription.find({ user: req.params.id });

        res.status(200).json({  // ✅ Changed 201 -> 200
            success: true,
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};
