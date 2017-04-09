var nodemailer = require('nodemailer');

module.exports = function(credentials) {

    var mailTransport = nodemailer.createTransport({
        service: credentials.email.provider,
        auth: {
            user: credentials.email.user,
            pass: credentials.email.password,
        }
    });
    return {
        send: function(response, to, idNum) {
            response.render('email/regemail', {
                layout: null,
                dbENum: idNum
            }, function(err, html) {
                if (err) console.log('Problem with email template.');
                mailTransport.sendMail({ //remove the 'SMTP as a parameter and it works
                    from: credentials.email.user,
                    to: to,
                    subject: 'Please confirm your email address with GenderPayGap',
                    html: html,
                    generateTextFromHtml: true
                }, function(err) {
                    if (err) console.error('Unable to send email:' + err.stack);
                });
            });
        },
    }
};
