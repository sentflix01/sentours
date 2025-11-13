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

  // -----------------------------
  // 1️⃣ Create Brevo SMTP transport
  // -----------------------------
  createTransport() {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
      tls: {
        rejectUnauthorized: false, // fixes some cloud deployment TLS issues
      },
    });
  }

  // -----------------------------
  // 2️⃣ Core send function
  // -----------------------------
  async send(template, subject) {
    try {
      // 2a) Render HTML from Pug template
      const html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        },
      );

      // 2b) Convert HTML to plain text
      const text = htmlToText.convert(html);

      // 2c) Send email
      const transporter = this.createTransport();
      await transporter.sendMail({
        from: this.from,
        to: this.to,
        subject,
        html,
        text,
        socketTimeout: 5 * 60 * 1000, // 5 minutes timeout for slow connections
      });

      console.log(`✅ Email sent successfully to ${this.to}`);
    } catch (err) {
      console.error('❌ Email sending failed:', err.message);
      throw err; // propagate error so controller can handle unverified users
    }
  }

  // -----------------------------
  // 3️⃣ Predefined email templates
  // -----------------------------
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
