const pug = require('pug');
const htmlToText = require('html-to-text');
const BrevoAPI = require('@getbrevo/brevo');
const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM; // Must be verified on Brevo
  }

  // Core email sending function
  async send(template, subject) {
    // 1️⃣ Generate HTML from Pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const text = htmlToText.convert(html);

    // 2️⃣ Production → Brevo API
    if (process.env.NODE_ENV === 'production') {
      try {
        const apiInstance = new BrevoAPI.TransactionalEmailsApi();

        apiInstance.setApiKey(
          BrevoAPI.TransactionalEmailsApiApiKeys.apiKey,
          process.env.BREVO_API_KEY,
        );

        const sendSmtpEmail = new BrevoAPI.SendSmtpEmail({
          sender: { email: this.from, name: 'Sentours Team' },
          to: [{ email: this.to }],
          subject,
          htmlContent: html,
          textContent: text,
        });

        await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log(`✅ Email sent to ${this.to} (Production/Brevo API)`);
        return;
      } catch (err) {
        console.error('❌ Brevo API Error:', err.response?.body || err.message);
        return;
      }
    }

    // 3️⃣ Development → SMTP (Mailtrap / Gmail)
    try {
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
        text,
      });

      console.log(`📩 Email sent to ${this.to} (Development/SMTP)`);
    } catch (err) {
      console.error('❌ Dev SMTP send failed:', err.message);
    }
  }

  // Predefined email methods
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

// const pug = require('pug');
// const htmlToText = require('html-to-text');
// const BrevoAPI = require('@getbrevo/brevo');
// const nodemailer = require('nodemailer');

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = process.env.EMAIL_FROM; // Must be verified on Brevo for prod
//   }

//   async send(template, subject) {
//     // 1️⃣ Generate HTML email
//     const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject,
//     });

//     // 2️⃣ Production → Brevo API (Updated)
//     if (process.env.NODE_ENV === 'production') {
//       try {
//         const BrevoAPI = require('@getbrevo/brevo');
//         const apiInstance = new BrevoAPI.TransactionalEmailsApi();

//         apiInstance.setApiKey(
//           BrevoAPI.TransactionalEmailsApiApiKeys.apiKey,
//           process.env.BREVO_API_KEY,
//         );

//         const sendSmtpEmail = new BrevoAPI.SendSmtpEmail();
//         sendSmtpEmail.sender = {
//           email: process.env.EMAIL_FROM,
//           name: 'Sentours Team',
//         };
//         sendSmtpEmail.to = [{ email: this.to }];
//         sendSmtpEmail.subject = subject;
//         sendSmtpEmail.htmlContent = html;
//         sendSmtpEmail.textContent = htmlToText.convert(html);

//         await apiInstance.sendTransacEmail(sendSmtpEmail);

//         console.log(`✅ Email sent to ${this.to} (Production/Brevo API)`);
//         return;
//       } catch (err) {
//         console.error('❌ Brevo API Error:', err.response?.body || err.message);
//         return;
//       }
//     }

//     // 3️⃣ Development → SMTP (Mailtrap / Gmail)
//     try {
//       const nodemailer = require('nodemailer');
//       const transport = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: Number(process.env.EMAIL_PORT),
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD,
//         },
//       });

//       await transport.sendMail({
//         from: this.from,
//         to: this.to,
//         subject,
//         html,
//         text: htmlToText.convert(html),
//       });

//       console.log(`📩 Email sent to ${this.to} (Development/SMTP)`);
//     } catch (err) {
//       console.error('❌ Dev SMTP send failed:', err.message);
//     }
//   }

//   async sendVerificationEmail() {
//     await this.send('verifyEmail', 'Please verify your email');
//   }

//   async sendWelcome() {
//     await this.send('welcome', 'Welcome to the Natours Family!');
//   }

//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your password reset token (valid for only 10 minutes)',
//     );
//   }
// };
