import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: process.env.AWS_SES_ENDPOINT, 
    port: 465,
    secure: true, // True for port 465, false for others
    auth: {
      user: process.env.AWS_SES_SMTP_USER,
      pass: process.env.AWS_SES_SMTP_PASS,
    }
});