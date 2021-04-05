const data = require('./data');
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: data.EMAIL,
        pass: data.PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
exports.sendEmail = (email, subject, html) => {
    var opts = {
        from: data.EMAIL,
        to: email,
        subject,
        html
    }
    transporter.sendMail(opts, (err, info) => {
        if(err) {
            console.log('ERROR MAILING! ' + err);
        } else {
            console.log('Email is sent to ' + email);
        }
    });

}


