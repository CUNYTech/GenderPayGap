var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(require('body-parser')());
var credentials = require('./credentials.js');      // remember to set your credentials.js file 
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
switch(app.get('env')) {
    case 'development': 
        mongoose.connect(credentials.mongo.development.connectionString, opts);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
};
var Unconfirmed = require('./models/unconfirmed.js');


var params = require('./lib/gpgParams.js');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

// page display and get/post functions 
app.get('/', function(request, response) {
   response.render('home', {pgTitle: params.getPgTitle('home'),
                            addCaptcha: true });
});
app.post('/', function(request, response) {
 /*   // Nicholas captcha code 
    if (request.body['g-recaptcha-response'] === undefined ||
        request.body['g-recaptcha-response'] === '' ||
        request.body['g-recaptcha-response'] === null) {
        return response.json({
            "responseCode": 1,
            "responseDesc": "Please select captca"
        });
    }
    // Insert Secret Key.
    var secretKey = credentials.secretKey;
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + 
        request.body['g-recaptcha-response'] + "&remoteip=" + request.connection.remoteAddress;
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
    //end Nicholas captcha code */

    var inpEmail = request.body.inpEmail.trim();                       // FRED - add server-side email verification
    if (inpEmail === "") return response.redirect(303, '/');
    request.session.inpEmail = inpEmail;
    
    Unconfirmed.findOne({userEmail: inpEmail}, '_id', function(err, unconfirmed) {
        if (unconfirmeds) {
            console.log(unconfirmed);
            return response.redirect(303, '/returnuser');
        }
        new Unconfirmed({
            userEmail: inpEmail
        }).save();
        response.redirect(303, '/thanks');
    });
});
app.get('/thanks', function(request, response) {
    if (!request.session.inpEmail) return response.redirect(303, '/');
    
    response.render('thanks', {pgTitle: params.getPgTitle('thanks'), 
                               inpEmail: request.session.inpEmail          //, dbENum: request.sesssion.dbENum
    }); 
});
app.get('/returnuser', function(request, response) {
    response.render('returnuser', {pgTitle: params.getPgTitle('returnuser'), 
                               inpEmail: request.session.inpEmail          //, dbENum: request.sesssion.dbENum
    }); 
});
app.get('/confirm', function(request, response) {
    inpEmail = request.query.inpEmail;                // BILLY! take inpEmail, check against db num and email exist.
                                                      //  FRED - if db can't confirm number, redirect to redirect page    
    request.session.conEmail = inpEmail;              //  this variable will change to db generated email address once confirmed
    response.render('confirm', {pgTitle: params.getPgTitle('confirm') });
    // how to do a time-delayed redirect to the dosurvey page
});
app.get('/dosurvey', function(request, response) {          // Fred - add referrer page restriction to disable back button
    response.render('dosurvey', {pgTitle: params.getPgTitle('dosurvey'), 
                                conEmail: request.session.conEmail,             
                                params: params,
                                inpForm: (request.session.inpForm) ? inpForm : false,    //params for validation failure
                                alarm: (request.session.alarm) ? alarm : false });
});
app.post('/prosurvey', function(request, response) {        //this function processes the form data, it does not render a page
    var passThru = true;
    var inpForm = {
        email: request.session.inpEmail
    };
    for (var i = 0; i < params.getReqFieldLen(); i++) {
        inpForm[params.getReqField(i)] = request.body[params.getReqField(i)];
        passThru = (request.body[params.getReqField(i)] != "");                    // if required fields are empty, do not passThru
    }
    if (!passThru) {
        request.session.inpForm = inpForm;
        request.session.alarm = true;
        return response.redirect(303, '/dosurvey');
    }
    for (var i = 0; i < params.getNonReqFieldLen(); i++) {
        inpForm[params.getNonReqField(i)] = request.body[params.getNonReqField(i)];
    }
                                                        // Fred - add filter for special characters for username, employer fields
                                                        // BILLY!  take inpform obj to add form data to db here
    request.session.proForm = inpForm;
    if (request.session.alarm) delete request.sesion.alarm;
    response.redirect(303, '/shosurvey');
});
app.get('/shosurvey', function(request, response) {      // add referrer page verification before entering page.
    if (!request.session.proForm) {
        response.redirect(303, '/');
    }
    var resDisp = params.getResDisp(request.session.proForm);
    response.render('shosurvey', {pgTitle: params.getPgTitle('shosurvey'),
                                  resDisp: resDisp });
});

//error page functions
app.use(function(request, response) {                   // this for page not found error
    response.status(404);
    response.render('404', {layout: 'error'});
});
app.use(function(err, request, response, next) {         // this for program/db error
    console.error(err.stack);
    response.status(500);
    response.render('500', {layout: 'error'});
});
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Cntrl-C to terminate.');
});

/*
    Unconfirmed.find(function(err, unconfirmeds) {
       var unconfList = {
           unconfirmeds: unconfirmeds.map(function(unconfirmed) {
               return {
                   id: unconfirmed._id,
                   userEmail: unconfirmed.userEmail,
                   sendDate: unconfirmed.sendDate,
               }
           })
        };
        console.log(unconfirmeds);
    });
    */
