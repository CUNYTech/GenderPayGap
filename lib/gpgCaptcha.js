var requester = require("request"); // node http request object

var CaptchaChek = function(request, response, secretKey, reLoc, successFunction) {
    // captcha code -- FRED move this code into a separate js util file so it can be reused.  params:  request, credentials
    if (request.body['g-recaptcha-response'] === undefined ||
        request.body['g-recaptcha-response'] === '' ||
        request.body['g-recaptcha-response'] === null) {
        request.session.errorMsg = 'Please check the Captcha box first';
        return response.redirect(303, reLoc);
    }
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" +
        request.body['g-recaptcha-response'] + "&remoteip=" + request.connection.remoteAddress;
    // Hitting GET request to the URL, Google responds with success or error.
    requester(verificationUrl, function(error, response, body) {
        body = JSON.parse(body);
        // Success will be true or false depending on validation.
        if (body.success !== undefined && !body.success) {
            request.session.errorMsg = 'Captcha verification failed. Please try again.';
            return response.redirect(303, reLoc);
        }
    });
    return successFunction();
};
module.exports = CaptchaChek;
