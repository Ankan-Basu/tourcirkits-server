//MAILGEN & NodeMailer
const Mailgen = require("mailgen");
const nodemailer = require("nodemailer");

var mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Tour CirKit",
    link: "https://tourcirkit.com/services",
  },
});
const sendMail = (email) => {
  var email1 = {
    body: {
      name: "Customer",
      intro: [
        "Thank you for reaching out to our customer support team. We appreciate the opportunity to assist you with your inquiry.",
        "Please reply to this email for further assistance with Query properly mentioned",
      ],

      greeting: "Dear",
      signature: "Truly",
      outro: "Looking forward to do more tour planning with you",
    },
  };
  let mail = mailGenerator.generate(email1);
  let transporter = nodemailer.createTransport({
    service:'Gmail',
    auth: {
      user: 'rohitbiswas14581@gmail.com',
      pass: 'mdxulnluuzbukdca',
    }
      
  });
  let msg = {
    from: "Tour CirKit <noreply@gmail.com>",
    to: email,
    subject: "Customer Support | Tour CirKit",
    html: mail,
  };
  transporter.sendMail(msg);
};

module.exports.mailer = (req, res) => {
  sendMail(req.query.email);
  res.send("ok");
}

