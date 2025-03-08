import transporter, { accountEmail } from "../config/nodemailer.js"; 
import { emailTemplates } from "./email-template.js"; 
import dayjs from "dayjs";

/**
 * Function to send an email reminder for a subscription renewal
 * @param {Object} param0 - Contains the recipient email, email type, and subscription details
 * @param {string} param0.to - The recipient's email address
 * @param {string} param0.type - The type of email to send (e.g., "Reminder 7 days before renewal")
 * @param {Object} param0.subscription - Subscription details (e.g., user, price, renewal date)
 */

export const sendEmailReminder = async ({ to, type, subscription }) => {
    // Make sure we have both the recipient email and the email type
    if (!to || !type) throw new Error("Missing required parameters");

    // Find the correct email template based on the type of email we need to send
    const template = emailTemplates.find((t) => t.label === type);

    // If no template matches the provided type, stop the function and throw an error
    if (!template) throw new Error("Invalid email type");

    // Gather all the necessary information to include in the email
    const mailInfo = {
        userName: subscription.user.name, // Name of the user
        subscriptionName: subscription.name, // Name of the subscription
        renewalDate: dayjs(subscription.renewalDate).format('MM D, YYYY'), // Format the renewal date
        planName: subscription.name, // Plan name (same as subscription name)
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`, // Price with currency and payment frequency
        paymentMethod: subscription.paymentMethod, // How the user pays (e.g., "Credit Card")
    };

    // Generate the email subject and body using the selected template
    const message = template.generateBody(mailInfo); // Email body content
    const subject = template.generateSubject(mailInfo); // Email subject line

    // Create the email options (who sends it, who receives it, subject, and content)
    const mailOptions = {
        from: accountEmail, // Sender's email (your system's email)
        to: to, // Recipient's email (the user)
        subject: subject, // Subject of the email
        html: message, // The email content in HTML format
    };

    // Send the email using the configured transporter
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error, 'Error sending email'); // If there's an error, log it
            return;
        }

        console.log(`Email sent: ` + info.response); // If successful, log the confirmation
    });
};
