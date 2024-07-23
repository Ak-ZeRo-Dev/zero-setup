import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";

export const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: true,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    // TODO Delete tls
    tls: {
      rejectUnauthorized: false,
    },
  });

  const { email, subject, template, data } = options;

  const html = await ejs.renderFile(
    path.join(__dirname, "../mails", template),
    data
  );

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
