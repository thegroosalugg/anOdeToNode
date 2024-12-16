import nodemailer from 'nodemailer';
import errorMsg from './errorMsg';
import dotenv from 'dotenv';
       dotenv.config();

const email = process.env.USER_EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.MAIL_KEY,
  },
});

export const sendMail = (token: string) => {
  transporter
    .sendMail({
           to: email,
         from: email,
      subject: 'An Ode to Node: Password Reset',
         html: `
           <a href="http://localhost:3000/login/?token=${token}">
             follow this link to reset your password
           </a>
           <p>
             http://localhost:3000/login/?token=${token}
           </p>
         `,
    })
    .catch((error) => errorMsg({ error, where: 'sendMail' }));
};
