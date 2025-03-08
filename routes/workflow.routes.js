import { Router } from "express"
const workflowRouter = Router();

import { sendReminders } from "../controller/workflow.js";

workflowRouter.post('/subscription/reminder', sendReminders);

export default workflowRouter;