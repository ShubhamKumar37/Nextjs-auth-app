const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "",
        pass: "",
    },
});

export const mailSender = async (email, body, subject, userId) =>
{
    try
    {
        const mailOptions = {
            from: "shubhamkumar2003@gmail.com.ai",
            to: email,
            subject: subject,
            html: "<h1>Hello world?</h1>"
        }

        const mailResponse = await transporter.sendMail(mailOptions);

        return mailResponse;    
    }
    catch(Error)
    {
        console.log("This is error in mail sender ", Error);
    }
}