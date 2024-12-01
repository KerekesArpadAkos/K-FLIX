import { createTransport } from 'nodemailer';
import { CONFIG } from '../config.js'; 

function sendEmail(req, res) {
  const { to, subject, text, html } = req.body;  

  var transporter = createTransport({
    service: 'gmail',
    auth: {
      user: CONFIG.EMAIL_USER,
      pass: CONFIG.EMAIL_PASS,
    },
  });

  var mailOptions = {
    from: CONFIG.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({ error: 'Failed to send email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send({ success: 'Email sent successfully!' });
    }
  });
}

export {
  sendEmail,
};
