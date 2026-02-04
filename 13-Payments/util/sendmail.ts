import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from './logger';
       dotenv.config();

const sender = process.env.SENDER_EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender,
    pass: process.env.MAIL_KEY,
  },
});

export const sendMail = (token: string, recipient: string) => {
  transporter
    .sendMail({
      to: sender,
      from: sender,
      subject: 'An Ode to Node: Password Reset',
      html: `
           <h1>D-Bay Express App Password Reset</h1>
           <a href="http://localhost:3000/login/?token=${token}">
             follow this link to reset your password
           </a>
           <p>Copy below URL is the above link does not work</p>
           <p>
             http://localhost:3000/login/?token=${token}
           </p>
         `,
    })
    .catch((error) => logger(500, { sendMail: error }));
};
