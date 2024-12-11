import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MAILGUN_API_KEY) {
    throw new Error('MAILGUN_API_KEY environment variable is not set');
}

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
});

export const sendVerificationEmail = async (email: string, verificationLink: string) => {

    const msg = {
        to: `${email}`,
        from: `support@ai-signals.com`,
        subject: 'Verify Your Email Address',
        text: `
            Welcome to Our App!
            
            Please verify your email address by clicking the link below:
            ${verificationLink}
            
            This link will expire in 1 hour.
            
            If you didn't create an account, you can safely ignore this email.
            
            Best regards,
            Your App Team
        `,
        html: `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #04091d; 
            padding: 20px;">
            <h2 style="color: white;">Welcome to Our App!</h2>

            <p style="color: white;">Please verify your email address by clicking the button below:</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="
                        background-color: #1A6DF5; 
                        color: white; 
                        padding: 14px 28px; 
                        text-decoration: none; 
                        border-radius: 5px;
                        display: inline-block;">
                    Verify Email Address
                </a>
            </div>
            <p style="color: #deebff;">Or copy and paste this link in your browser:</p>
            <p style="color: #deebff; word-break: break-all;">${verificationLink}</p>
            <p style="color: #deebff; font-size: 0.9em;">This link will expire in 1 hour.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #deebff; font-size: 0.8em;">
                If you didn't create an account, you can safely ignore this email.
            </p>
        </div>
        `
    };

    try {
        await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
            ...msg,
            from: msg.from,
        });
        console.log('Verification email sent successfully!');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};