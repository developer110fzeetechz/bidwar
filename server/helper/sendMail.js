import nodemailer from 'nodemailer';

export const sendMail = async () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use true for port 465
        auth: {
            user: "atiqur.mdrahaman@gmail.com",
            pass: "sjdx vorp jndm jdvm" // Ensure to use an app password, not your Gmail account password
        }
    });

    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
            <img 
                src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D" 
                alt="Welcome Banner" 
                style="width: 100%; max-width: 600px; height: auto; margin-bottom: 20px;"
            />
            <h2 style="color: #4CAF50;">Thank You for Joining Us!</h2>
            <p>Hi there,</p>
            <p>We’re thrilled to have you with us. Here’s a quick message to welcome you:</p>
            <blockquote style="font-style: italic; border-left: 4px solid #4CAF50; padding-left: 10px; margin: 20px auto;">
                “Thank you for joining us, we’re here for you.”
            </blockquote>
            <p>If you have any questions or need support, feel free to reach out to us at any time.</p>
            <p style="margin-top: 20px;">Cheers,<br>The Team</p>
            <hr>
            <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply.</p>
        </div>
    `;

    const info = await transporter.sendMail({
        from: "atiqur.mdrahaman@gmail.com",
        to: "developer110.fzeetechz@gmail.com",
        subject: "Player Testing",
        html: htmlTemplate // Include the HTML template
    });

    console.log("Message sent: %s", info.messageId);
};
