import { Router } from "express";
import { getAllUsers, getUser } from "../controller/user.js";
import authorize from "../Middleware/auth.middleware.js"

const userRoute = Router();

// get all user
userRoute.get('/', getAllUsers)

// get specific details for user
userRoute.get('/:id', authorize, getUser)

//create user
userRoute.post('/', (req, res) => {
    res.send({title: "Create user"})
})

//update user
userRoute.put('/:id', (req, res) => {
    res.send({title: "Update User"})
})

//delete user
userRoute.delete('/:id', (req, res) => {
    res.send({title: "Delete User"})
})

export default userRoute;


