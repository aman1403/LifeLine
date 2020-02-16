const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/:emailId', (req, res, next) => {

    const to = req.body.to;
    const subject = req.body.subject;
    const text = req.body.text;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bscms2018@gmail.com',
          pass: 'password@12345',
        }
      });
      
      var mailOptions = {
        from: 'bscms2018@gmail.com',
        to: to,
        subject: subject,
        text: text,
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
});

module.exports = router;



