const nodemailer = require("nodemailer");
const config = require("./auth.config");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

exports.sendEmailToResetPassword = async (name, email, otp) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Here is the link to change the password",
      html: `<h1>Reset your password</h1>
            <h2>Hello ${name}</h2>
            <p>Use this OTP to change your password </p>
            <h3>Your otp is - ${otp}</h3>
            </div>`,
    })
    .catch((err) => console.log(err));
};

exports.sendEmailForResetPasswordSuccess = async (name, email) => {
  transport.sendMail({
    from: user,
    to: email,
    subject: "Password is changed successfully",
    html: `<h1>Your password is changed</h1>
          <h2>Hello ${name}</h2>
          <p>Make sure to remember it this time </p>
          </div>`,
  })
  .catch((err)=> console.log(err));
};

exports.sendConfirmationEmail = async (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
            </div>`,
    })
    .catch((err) => console.log(err));
};
