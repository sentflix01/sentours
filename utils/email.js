const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user,url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Sintayehu Mulugeta <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Brevo SMTP
      return nodemailer.createTransport({
        service: 'Brevo',
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_PASS,
        },
        secure: false,
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 5000, // 5 seconds
        socketTimeout: 10000, // 10 seconds
      });
    }
    //Mailtrap or Gmail SMTP
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false, // Mailtrap does not use SSL(Secure Layer) by default
    });
    return transport;
  }

  async send(template, subject) {
    console.log('Sending email to:', this.to);
    console.log('From:', this.from);
    console.log('Template:', template);

    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    console.log('Mail options:', mailOptions);

    // 3) create a transport and send email with timeout
    const transport = this.newTransport();

    // Wrap sendMail with a timeout
    const sendWithTimeout = (mailOptions, timeout = 15000) => {
      return Promise.race([
        transport.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timeout')), timeout),
        ),
      ]);
    };

    try {
      const result = await sendWithTimeout(mailOptions);
      console.log('Email sent successfully:', result);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
  async sendVerificationEmail() {
    await this.send('verifyEmail', 'Please verify your email');
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Familly!');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your Password reset token (valid for only 10 minutes)',
    );
  }
};
