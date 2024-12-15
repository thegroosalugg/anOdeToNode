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

export const sendMail = () => {
  transporter
    .sendMail({
           to: email,
         from: email,
      subject: 'An Ode to Node: Password Reset',
         html: '<h1>This is a test</h1>',
    })
    .catch((error) => errorMsg({ error, where: 'sendMail' }));
};
