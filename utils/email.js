const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        // secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Define the email options
    const mailOptions = {
        from: 'Gad Reda <ToDO@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message   
    };

    // Actually send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;