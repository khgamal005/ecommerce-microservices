import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const renderEmailTemplate = async (
  data: Record<string, any>
): Promise<string> => {
  const templetePath = path.join(
    process.cwd(),
    'apps',
    'auth-service',
    'src',
    'utils',
    'emailTemplates',
    `${data.templete}.ejs`
  );
  return ejs.renderFile(templetePath, data);
};

export async function sendEmail(
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, any>
) {
  try {
    const html = await renderEmailTemplate({ templete: templateName, ...data });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Eshop <khgamal005@gmail.com>',
      to,
      subject,
      html, // you can pass your reactHTML converted to string
    });

    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    return error;
  }
}