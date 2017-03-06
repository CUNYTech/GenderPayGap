var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
var params = require('./lib/gpgParams.js');

app.set('port', process.env.PORT || 3000);
/*
    app.use(require('cookie-parser')(credentials.cookieSecret));
    app.use(require('express-session')());
    app.use(function(request, response, next) {
    response.locals.showTests = app.get('env') !== 'production' && request.query.test === '1';
    next();
}); */
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

var inpEmail, inpForm;

app.get('/', function(request, response) {
    response.render('home');
});
app.get('/confirm', function(request, response) {
    response.render('confirm', {
        inpEmail: inpEmail,
        params: params
    });
});

app.post('/confirm', function(request, response) {
    // Recaptcha-Response
    if (request.body['g-recaptcha-response'] === undefined ||
        request.body['g-recaptcha-response'] === '' ||
        request.body['g-recaptcha-response'] === null) {
        return response.json({
            "responseCode": 1,
            "responseDesc": "Please select captca"
        });
    }
    // Insert Secret Key.
    var secretKey = "6Le8sBcUAAAAANLR9rp8WhGVHjXApztLLmsbkK-_";
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + request.body['g-recaptcha-response'] + "&remoteip=" + request.connection.remoteAddress;
    // Hitting GET request to the URL, Google responds with success or error.
    request(verificationUrl, function(error, response, body) {
        body = JSON.parse(body);
        // Success will be true or false depending on validation.
        if (body.success !== undefined && !body.success) {
            return response.json({
                "responseCode": 1,
                "responseDesc": "Failed captcha verification"
            });
        }
    });
    response.json({
        "responseCode": 0,
        "responseDesc": "Success"
    });
});

app.get('/thanks', function(request, response) {
    response.render('thanks', {
        inpEmail: inpEmail
    });
});
app.post('/', function(request, response) {
    inpEmail = request.body.inEmail;
    //request.session.inpMail = inpEmail;
    return response.redirect(303, '/thanks');
});
app.use(function(request, response) {
    response.status(404);
    response.render('404', {
        layout: 'error'
    });
});
app.use(function(err, request, response, next) {
    console.error(err.stack);
    response.status(500);
    response.render('500', {
        layout: 'error'
    });
});
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
