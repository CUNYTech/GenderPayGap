/* Fred - create an email resubmit page (for people who don't confirm email right away but email is in our db), set up and error page*/

var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(require('body-parser')());
var credentials = require('./credentials.js');      // remember to set your credentials.js file 
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());
var mongoose = require('mongoose');             // mongoose connection and schema builders
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
var Unconfirmed = require('./models/unconfirmed.js');            // mongoose schema
var Confirmed = require('./models/confirmed.js');                // mongoose schema
                
var params = require('./lib/gpgParams.js');                 // the main parameters for the site
var CaptchaChek = require('./lib/gpgCaptcha.js');           // captcha verification moved here.
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(function(request, response, next) {                 // for flash error messages
    response.locals.flash = request.session.flash;
    delete request.session.flash;
    next();
});
// page display and get/post functions 
app.get('/', function(request, response) {
   response.render('home', {pgTitle: params.getPgTitle('home'),   
                            inpEmail: (request.session.inpEmail) ? request.session.inpEmail : false,
                            errorMsg: (request.session.errorMsg) ? request.session.errorMsg : false,
                            addCaptcha: true });
});
app.post('/', function(request, response) {
    var inpEmail = request.body.inpEmail.trim();                    // FRED - add server-side email verification
    if (inpEmail === "") return response.redirect(303, '/');
    request.session.inpEmail = inpEmail;                            // add email input to session memory
    
    var dbSave = function() {                                       // this is a callback after the captchachek
        Unconfirmed.findOne({userEmail: inpEmail}, '_id', function(err, user) {
            if (err) throw err;
            if (user) {                                                 // if email exists already, do not re-save
                console.log(user);
                if (!user.confirmed)                                    // if email exists but is not confirmed
                    return response.redirect(303, '/resubmit');       // redirect to FRED!! -- create resubmit page 
                else 
                    return response.redirect(303, '/returnuser');      // if email exists and confirmed, redirect to returnuser
            }
            new Unconfirmed({                                         // add email to unconfirmedemails collec. 
                userEmail: inpEmail                
                }).save();
            if (request.session.errorMsg) delete request.session.errorMsg;
            response.redirect(303, '/thanks');
        });
    };
    CaptchaChek(request, response, credentials.secretKey, '/', dbSave);   //captchacheck verification
});
app.get('/resubmit', function(request, response) {
    var inpEmail;
    if (request.session.inpEmail) {
        inpEmail = request.session.inpEmail;
    } else {
        request.session.flash = {
            type: 'warning',
            intro: 'Internal Error',
            message: 'An error occured. Please start over.',
        };
        return response.redirect(303, '/');
    }
    response.render('resubmit', {pgTitle: params.getPgTitle('resubmit'), 
                                   inpEmail: inpEmail,                                        
    }); 
    
});
app.get('/thanks', function(request, response) {
    var inpEmail;
    if (request.session.inpEmail) {
        inpEmail = request.session.inpEmail;
    } else {
        request.session.flash = {
            type: 'warning',
            intro: 'Internal Error',
            message: 'An error occured. Please start over.',
        };
        return response.redirect(303, '/');
    }
    var mailAndRender = function(idNum) {
        response.render('thanks', {pgTitle: params.getPgTitle('thanks'), 
                                   inpEmail: inpEmail, 
                                   dbENum: idNum,                                                // send id to 'email' link
        }); 
    };
    if (request.session.dbENum) {
        mailAndRender(request.session.dbENum);
    } else {
        Unconfirmed.findOne({userEmail: request.session.inpEmail}, '_id', function(err, user) {         //get id of email input
            if (!user) {
                return response.redirect(303, '/');
            }
            mailAndRender(user._id);
        });
    }
});
app.get('/confirm', function(request, response) {   // Fred - add referrer page restriction to disable back button
    var unconfE;
    if (request.query.unconfE)
        unconfE = request.query.unconfE;                    // id comes from GET request, if not, redirect to home page
    else    
        return response.redirect(303, '/');                    //FRED - create error page fo
    
    Unconfirmed.findById(unconfE, function(err, dbEmail) {
        if (err) throw (err);
                                                // if there is no record, or the record has no email address, reject, send home
        if (!dbEmail || !dbEmail.userEmail) return response.redirect(303, '/');
        if (dbEmail.confirmed) {                        // if id is unconfirmed, send to resubmit page (create it)
            request.session.confE = unconfE;           
            return response.redirect(303, '/returnuser');   // change to resubmit page (once created)
        }
        dbEmail.confirmed = true;                          // set email in unconfirmedemail as confirmed
        dbEmail.save(function(err) {
            if (err) throw err;
        });
        
        var newUser = new Confirmed({                      // create new entry in confirmedemail collection
            email: dbEmail.userEmail
        });
        newUser.save(function (err) {
            if (err) throw err;
            Confirmed.findOne({email: dbEmail.userEmail}, '_id', function(err, user) {      //THIS SHOULD BE A PROMISE!!!!! 
                if (err) throw err;
                request.session.surveyId = user._id;       // this is the new id number in Confirmed, add to session mem for dosurvey 
                delete request.session.unconfE;
                delete request.session.inpEmail;
                return response.render('confirm', {pgTitle: params.getPgTitle('confirm') });
                // how to do a time-delayed redirect to the dosurvey page
            });
        });
    });
});
app.get('/dosurvey', function(request, response) {          // Fred - add referrer page restriction to disable back button
    var surveyId;
    if (request.session.surveyId)
        surveyId = request.session.surveyId;
    else 
        return response.redirect(303, '/');
    Confirmed.findById(surveyId, function(err, user) {
        if (err) console.log(err);
                                                    // if there is no record, or the record has no email address, reject, send home
        if (!user || !user.email) return response.redirect(303, '/');
        response.render('dosurvey', {pgTitle: params.getPgTitle('dosurvey'), 
                                     conEmail: user.email,             
                                     params: params,
                                     inpForm: (request.session.inpForm) ? inpForm : false,  //params for if SS validation sees a problem
                                     alarm: (request.session.alarm) ? alarm : false   // this is for error code - serverside validation  
        });                                                    
    });
});
app.post('/prosurvey', function(request, response) {        //this function processes the form data, it does not render a page
    var surveyId;
    if (request.session.surveyId)
        surveyId = request.session.surveyId;
    else 
        return response.redirect(303, '/');
    
    var passThru = true;                                   
    var inpForm = {
        surveyDate: new Date                // this isn't going through, check -FRED
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
                                                        // Fred - add sql injection for username, employer fields, job title
                                                        //  add form data to db here 
    Confirmed.findById(surveyId, function(err, user) {
        if (err) throw (err);
                                                    // if there is no record, or the record has no email address, reject, send home
        if (!user || !user.email) return response.redirect(303, '/');
        inpForm.email = user.email;
        for (var i = 1; i < params.allFieldsMap.length; i++) {           // start at index 1 since email (index 0) is already there.
            user[params.allFieldsMap[i]] = inpForm[params.allFieldsMap[i]];
        }
        user.save(function(err) {
            if (err) throw (err);
            request.session.dispForm = inpForm;
            if (request.session.alarm) delete request.sesion.alarm;
            response.redirect(303, '/shosurvey');        
        });
    });
});
app.get('/shosurvey', function(request, response) {      // add referrer page verification before entering page.
    if (!request.session.dispForm) {
        response.redirect(303, '/');
    }
    var dispForm = params.getResDisp(request.session.dispForm);    //transform form input into layout for display-translate param codes
    response.render('shosurvey', {pgTitle: params.getPgTitle('shosurvey'),
                                  dispForm: dispForm });
});
app.get('/returnuser', function(request, response) {                // this page for emails already confirmed, check if survey completed
    response.render('returnuser', {pgTitle: params.getPgTitle('returnuser'), 
                                   inpEmail: request.session.inpEmail          
    }); 
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

    
    
    