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

  // newTransport() {
  //   if (process.env.NODE_ENV === 'production') {
  //     //Brevo
  //     return nodemailer.createTransport({
  //       service: 'Brevo',
  //       // host: process.env.BREVO_HOST,
  //       // port: Number(process.env.BREVO_PORT),
  //       auth: {
  //         user: process.env.BREVO_USER,
  //         pass: process.env.BREVO_PASS,
  //       },
  //       secure: false,
  //     });
  //   }

  //   return nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     port: Number(process.env.EMAIL_PORT),
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //     secure: false, // Mailtrap does not use SSL by default
  //   });
  // }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Brevo
      return nodemailer.createTransport({
        service: 'Brevo',
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_PASS,
        },
        secure: false,
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false, // Mailtrap does not use SSL by default
    });

    // Test the connection
    transport.verify((error, success) => {
      if (error) {
        console.log('Email transport error:', error);
      } else {
        console.log('Email transport ready:', success);
      }
    });

    return transport;
  }

  // // send the actual email
  // async send(template, subject) {
  //   // 1) Render HTML based on a pug template
  //   const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
  //     firstName: this.firstName,
  //     url: this.url,
  //     subject,
  //   });

  //   // 2) Define email options
  //   const mailOptions = {
  //     from: this.from,
  //     to: this.to,
  //     subject,
  //     html,
  //     text: htmlToText.convert(html),
  //   };
  //   // 3) create a transport and send email
  //   await this.newTransport().sendMail(mailOptions);
  // }
  // send the actual email
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

    // 3) create a transport and send email
    const result = await this.newTransport().sendMail(mailOptions);
    console.log('Email sent successfully:', result);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Familly!');
  }
  async sendPasswordReset() {
    await this.send(
      'PasswordReset',
      'Your Password reset token (valid for only 10 minutes)',
    );
  }
};
