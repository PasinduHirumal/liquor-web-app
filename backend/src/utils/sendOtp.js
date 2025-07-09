import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../templates/emailTemplates.js';
import transporter from '../config/nodemailer.js';
import dotenv from 'dotenv';

dotenv.config();

const sendOtp = async (mailData, mailAction) => {
    const mailOptions = {};

    if (mailAction === "verify") {
        mailOptions.from = process.env.SENDER_EMAIL,
        mailOptions.to = mailData.to,
        mailOptions.subject = mailData.subject,
        //mailOptions.text = mailData.text,
        mailOptions.html = EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", mailData.otp).replace("{{email}}", mailData.to).replace("{{time}}", mailData.time)
    }

    if (mailAction === "reset") {
        mailOptions.from = process.env.SENDER_EMAIL,
        mailOptions.to = mailData.to,
        mailOptions.subject = mailData.subject,
        //mailOptions.text = mailData.text,
        mailOptions.html = PASSWORD_RESET_TEMPLATE.replace("{{otp}}", mailData.otp).replace("{{email}}", mailData.to).replace("{{time}}", mailData.time)
    }
    

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending otp to email:', error.message);
        return null;
    }
};

export default sendOtp;