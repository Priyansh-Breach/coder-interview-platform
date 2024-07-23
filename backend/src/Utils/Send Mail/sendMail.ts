require("dotenv").config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

/**
 * Email options Interface
 */
interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

/**
 * Send Mail function
 */
export const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_SMTP_HOST,
    port: parseInt(process.env.NODEMAILER_SMTP_PORT || "587"),
    service: process.env.NODEMAILER_SMTP_SERVICE,
    auth: {
      user: process.env.NODEMAILER_SMTP_MAIL,
      pass: process.env.NODEMAILER_SMTP_PASSWORD,
    },
  });
  const { email, subject, template, data } = options;

  /**
   * Path to the Email template file
   */
  const templatePath = path.join(
    __dirname,
    "../../mails/",
    template
  );

  /**
   * Rendering the Email template file with EJS
   */
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.NODEMAILER_SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  /**
   * Sending Mail
   */
  await transporter.sendMail(mailOptions);
};