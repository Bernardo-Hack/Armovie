import nodemailer from "nodemailer";

// Nodemailer config
// change .env later to use different providers, for now it only supports Gmail

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("Email configuration verified successfully.");
  } catch (err) {
    console.error("Error in email configuration:", err);
  }
};

export const sendMail = async (payload: { to: string; subject: string; text: string }) => {
  const msg = {
    from: process.env.EMAIL_ADDRESS,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    //html: `<p>${payload.text}</p>`, create html version of the email later
  }

  await transporter.sendMail(msg);
};
