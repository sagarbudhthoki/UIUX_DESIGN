const nodeMailer = require("nodemailer");

exports.sendMail = async (email, subject, text) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      // service: process.env.SMTP_SERVICE,
      // secure: true,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_USER,
      to: email,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}: ${error.message}`);
  }
};
