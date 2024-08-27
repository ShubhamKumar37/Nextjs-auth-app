const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const mailSender = async (email, body, subject, route, uniqueToken) =>
{
    try
    {
        const mailOptions = {
            from: "shubhamkumar200334@gmail.com.ai",
            to: email,
            subject: subject,
            html: `
            <p>${body}</p>
            <a href="${process.env.DOMAIN}/${route}/${uniqueToken}">Click here </a>
            `
        }

        const mailResponse = await transporter.sendMail(mailOptions);

        return mailResponse;    
    }
    catch(Error)
    {
        console.log("This is error in mail sender ", Error);
    }
}