const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Sentours Team <${process.env.EMAIL_FROM}>`;
  }

  // Create Brevo SMTP transport
  createTransport() {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', // Brevo SMTP server
      port: 587, // or 465 if using SSL
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });
  }

  // Core send function for all templates
  async send(template, subject) {
    try {
      // 1️⃣ Generate HTML using Pug template
      const html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        },
      );

      // 2️⃣ Convert HTML to plain text
      const text = htmlToText.convert(html);

      // 3️⃣ Send the email using Brevo transport
      const transporter = this.createTransport();

      await transporter.sendMail({
        from: this.from,
        to: this.to,
        subject,
        html,
        text,
      });

      console.log(`Email sent successfully to ${this.to}`);
    } catch (err) {
      console.error('Email sending failed:', err.message);
      throw err;
      return;
    }
  }

  // 🎯 Predefined email templates
  async sendVerificationEmail() {
    await this.send('verifyEmail', 'Please verify your email address');
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Sentours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
