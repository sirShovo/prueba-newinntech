const nodemailer = require('nodemailer');
require("dotenv").config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.verify().then(() => {
  console.log('Ready for send emails');
});

const sendEmail = async (email, subject, html, title) => {
  try {
    await transporter.sendMail({
      from: `NewInntech - ${ title } <${ process.env.GMAIL }>`,
      to: email,
      subject,
      html,
    })
  } catch (error) {
    console.log(error);
  }
}

const getTemplate = (email, token, type) => {
  if (type === 'confirm') {
    return `
      <div id="email__content">
        <h2>Welcome ${ email }</h2>
        <p>To confirm your account, enter the following link.</p>
        <a href="http://localhost:${ process.env.PORT }/confirm/${ token }">Confirm Account</a>
      </div>
    `;
  } 
  
  if (type === 'forgot') {
    return `
      <div id="email__content">
        <h2>Hi ${ email }, </h2>
        <p>To change your password you must copy the token and enter the password in a new query.</p>
        <p>Send the token and password to this route: http://localhost:${ process.env.PORT }/recovery</p>
        </br>
        <strong style="overflow-wrap: break-word;">${ token }</strong>
      </div>
    `;
  }
}

module.exports = {
  sendEmail,
  getTemplate
}
