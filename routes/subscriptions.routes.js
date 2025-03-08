import { Router } from "express";
import { createSubscription, getAllSubscriptions, getUserSubscription } from "../controller/subscription.js";
import authorize from "../Middleware/auth.middleware.js";

const subscriptionRouter = Router();

//get all subscribe users
subscriptionRouter.get('/', authorize, getAllSubscriptions);

//get subscription details
subscriptionRouter.get('/:id', (req, res) => {
    res.send({title: "Get subscription details"})
})

//update subscription
subscriptionRouter.put('/id', (req, res) => {
    res.send({title: "Update subscription details"})
})

//create subscription
subscriptionRouter.post('/', authorize, createSubscription);

//delete subscription
subscriptionRouter.delete('/:id', (req, res) => {
    res.send({title: "Delete subscription"})
})

//get user subscriptions
subscriptionRouter.get('/user/:id', authorize, getUserSubscription)

//cancel subscription
subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({title: "Cancel subscription"})    
})

//get upcoming renewal of subscriptions
subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({title: "Getting upcoming renewal"}) 
})


export default subscriptionRouter;