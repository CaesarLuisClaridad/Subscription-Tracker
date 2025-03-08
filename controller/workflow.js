import dayjs from 'dayjs'; // for date manipulation
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express"); // Import Upstash workflow service
import Subscription from '../model/subscription.model.js'; // Import Subscription model
import { sendEmailReminder } from '../utils/send-email.js';

// Define an array of days before renewal to send reminders
const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload; // Extract subscriptionId from request payload
    const subscription = await fetchSubscriptions(context, subscriptionId); // Fetch the subscription details

    // Check if the subscription exists and is active
    if (!subscription || subscription.status !== 'active') {
        console.log(`Subscription ${subscriptionId} is not active or does not exist.`);
        return;
    }

    // Get the renewal date as a Day.js object
    const renewalDate = dayjs(subscription.renewalDate);

    // If the renewal date is already past, stop the workflow
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    // Loop through the reminder days (7, 5, 2, 1 days before renewal)
    for (const daysBefore of REMINDERS) {
        // Calculate the reminder date by subtracting days from the renewal date
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        // If the reminder date is in the future, schedule a sleep until that date
        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before reminder`, reminderDate);
        }

        // After waking up, trigger the reminder notification
        if(dayjs().isSame(reminderDate, 'day')){
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
});

// Function to fetch the subscription from the database
const fetchSubscriptions = async (context, subscriptionId) => {
    return await context.run('get subscriptions', async () => {
        return Subscription.findById(subscriptionId).populate("user", "name email");
    });
};


// Function to delay execution until the reminder date
const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate()); // Pause execution until the specified date
};

// Function to trigger the actual reminder
const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`); // Log the reminder trigger

        await sendEmailReminder({
            to: subscription.user.email,
            type: label,
            subscription
        })
    });

};
