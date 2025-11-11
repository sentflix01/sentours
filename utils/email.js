const pug = require('pug');
const htmlToText = require('html-to-text');
const BrevoAPI = require('@getbrevo/brevo');
const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM; // Must be verified on Brevo for prod
  }

  async send(template, subject) {
    // 1️⃣ Generate HTML email
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2️⃣ Production → Brevo API
    if (process.env.NODE_ENV === 'production') {
      try {
        const BrevoAPI = require('@getbrevo/brevo');
        const apiInstance = new BrevoAPI.TransactionalEmailsApi();
        apiInstance.setApiKey(
          BrevoAPI.TransactionalEmailsApiApiKeys.apiKey,
          process.env.BREVO_API_KEY,
        );

        await apiInstance.sendTransacEmail({
          sender: { email: process.env.EMAIL_FROM, name: 'Sentours Team' },
          to: [{ email: this.to }],
          subject,
          htmlContent: html,
          textContent: htmlToText.convert(html),
        });

        console.log(`Email sent to ${this.to} (Production/Brevo API)`);
        return;
      } catch (err) {
        console.error('Brevo email sending failed:', err.message);
        // do not crash server — fallback to no email
        return;
      }
    }

    // 3️⃣ Development → SMTP (Mailtrap / Gmail)
    try {
      const nodemailer = require('nodemailer');
      const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transport.sendMail({
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.convert(html),
      });

      console.log(`📩 Email sent to ${this.to} (Development/SMTP)`);
    } catch (err) {
      console.error('Dev SMTP send failed:', err);
    }
  }

  async sendVerificationEmail() {
    await this.send('verifyEmail', 'Please verify your email');
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};

// #########################################################################

// const nodemailer = require('nodemailer');
// const pug = require('pug');
// const htmlToText = require('html-to-text');

// // new Email(user,url).sendWelcome();

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = `Sintayehu Mulugeta <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       //Brevo SMTP
//       return nodemailer.createTransport({
//         host: 'smtp-relay.brevo.com',
//         port: 587, // TLS(Transport Layer Security) port
//         secure: false,
//         auth: {
//           user: process.env.BREVO_USER,
//           pass: process.env.BREVO_PASS,
//         },
//         tls: {
//           rejectUnauthorized: false, // avoids certificate errors on Render
//         },
//         connectionTimeout: 10000, // 10 seconds
//         greetingTimeout: 5000, // 5 seconds
//         socketTimeout: 10000, // 10 seconds
//       });
//     }
//     //Mailtrap or Gmail SMTP
//     const transport = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: Number(process.env.EMAIL_PORT),
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//       secure: false, // Mailtrap does not use SSL(Secure Layer) by default
//     });
//     return transport;
//   }

//   async send(template, subject) {
//     // 1) Render HTML based on a pug template
//     const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject,
//     });

//     // 2) Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText.convert(html),
//     };

//     // 3) create a transport and send email with timeout
//     const transport = this.newTransport();

//     // Wrap sendMail with a timeout
//     const sendWithTimeout = (mailOptions, timeout = 15000) => {
//       return Promise.race([
//         transport.sendMail(mailOptions),
//         new Promise((_, reject) =>
//           setTimeout(() => reject(new Error('Email sending timeout')), timeout),
//         ),
//       ]);
//     };

//     try {
//       const result = await sendWithTimeout(mailOptions);
//     } catch (error) {
//       throw error;
//     }
//   }
//   async sendVerificationEmail() {
//     await this.send('verifyEmail', 'Please verify your email');
//   }
//   async sendWelcome() {
//     await this.send('welcome', 'Welcome to the Natours Familly!');
//   }
//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your Password reset token (valid for only 10 minutes)',
//     );
//   }
// };
