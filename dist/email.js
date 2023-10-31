import nodemailer from 'nodemailer';
import logger from './logger.js';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
export default async function (address, subject, body) {
    try {
        await transporter.sendMail({
            from: `"X-Pkg Registry" <${process.env.EMAIL_FROM}>`,
            to: address,
            subject,
            text: body
        });
    }
    catch (e) {
        logger.error(e, 'There was an error sending an email');
    }
}
//# sourceMappingURL=email.js.map