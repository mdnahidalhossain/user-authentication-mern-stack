import { mailtrapClient, sender } from "./mailtrapConfig.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./verificationMailTemplate.js";

export const sendVerificationMail = async (email, verificationToken) => {
    const recipients = [
        {
            email,
        }
    ];

    try {
        const response = await mailtrapClient
            .send({
                from: sender,
                to: recipients,
                subject: "Mailtrap Verification Mail Test",
                html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
                category: "Email Verification Test",
            })

        console.log("Email sent successfully!", response)
    } catch (error) {
        console.log("Error sending veification!", error)
        throw new Error(`Error sending veification email: ${error}`)
    }
}

export const sendWelcomeMail = async (email, userName) => {
    const recipients = [
        {
            email,
        }
    ];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "9079acfc-c74f-42c4-9f01-cdbcf100dc62",
            template_variables: {
                "name": userName
            }
        })
        console.log("Welcome Email sent successfully!", response)
    } catch (error) {
        console.log("Error sending Welcome email!", error)
        throw new Error(`Error sending Welcome email: ${error}`)
    }
}

export const sendPasswordResetMail = async (email, resetURL) => {
    const recipients = [
        {
            email,
        }
    ];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "REset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset Mail"
        })
        console.log("Email sent successfully!", response)
    } catch (error) {
        console.log("Error sending password reset mail!", error)
        throw new Error(`Error sending password reset email: ${error}`)
    }
}

export const sendResetSuccessMail = async (email) => {
    const recipients = [
        {
            email,
        }
    ];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Password reset successful!",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success Mail"
        })
        console.log("Email sent successfully!", response)
    } catch (error) {
        console.log("Error sending password reset success mail!", error)
        throw new Error(`Error sending password reset success email: ${error}`)
    }
}