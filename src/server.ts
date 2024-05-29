// @ts-check

import express from 'express';
import payload from 'payload';
import nodemailer from 'nodemailer';

require('dotenv').config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

// Tạo custom Nodemailer transport
const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
    email: {
      fromName: 'Admin',
      fromAddress: 'admin@example.com',
      transport,
    },
  });

  // Add your own express routes here

  app.listen(process.env.PORT);
};

start();
