var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(require('body-parser')());
var credentials = require('./credentials.js');      // remember to set your credentials.js file 
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = credentials.mongoUrl;

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

    var inpEmail = request.body.inpEmail;                       // FRED - add server-side email verification
    
    /* BILLY - take inpEmail, do a find, if doesn't exist, create new record with email, then find email, get id number
        if email is found, redirect to different page
            if (email already in db) {
                response.redirect(303, '/returnuser');
            }  
        we can then deal with existing emails later. 
        var dbEnum = [id of email];
        request.session.dbENum = dbENum; 
    */
    var insertDocuments = function(db, callback){
		//Get the documents collection
		var collection = db.collection('documents');
		//Insert some documents
		collection.insert( {email: inpEmail, confirmed: false}, function(err, result) { // creates new record
            collection.find({email: inpEmail}).toArray(function(err, info) {          // finds record just created, sends to array info
                console.log(info[0]);                        // you can see here that it outputs the id but try getting it!
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                assert.equal(1, result.ops.length);
                callback(result); 
            });
		});
	};
	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, db){
		assert.equal(null, err);
		console.log("Connected successfully to the server");
		insertDocuments(db, function(){
			//var collection = db.collection('documents');
			//collection.remove();
            db.close();
		}); 
	});
    // End Billy mongo code
    request.session.inpEmail = inpEmail;                       
    response.redirect(303, '/thanks');
});
app.get('/thanks', function(request, response) {
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
