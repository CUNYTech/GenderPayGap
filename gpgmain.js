/* Fred - create an email resubmit page (for people who don't confirm email right away but email is in our db), set up and error page*/
var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main'
});
var bodyParser = require('body-parser');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var credentials = require('./credentials.js'); // remember to set your credentials.js file
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
    secret: 'CREAM', // Wu Tang!
    resave: false,
    saveUninitialized: true
}));
var mongoose = require('mongoose'); // mongoose connection and schema builders
mongoose.Promise = global.Promise;

var opts = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};
switch (app.get('env')) {
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, opts);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
};
var Unconfirmed = require('./models/unconfirmed.js'); // mongoose schema
var Confirmed = require('./models/confirmed.js'); // mongoose schema

var params = require('./lib/gpgParams.js'); // the main parameters for the site
var CaptchaChek = require('./lib/gpgCaptcha.js'); // captcha verification here.
var emailSender = require('./lib/gpgEmailer.js')(credentials); // emailer utilities here
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(function(request, response, next) { // for flash error messages
    response.locals.flash = request.session.flash;
    delete request.session.flash;
    next();
});

// Packages for logging in.
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var bcrypt = require('bcryptjs');

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Global Variables For Session Mesages.
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
// Landing page: home, parameters of inpEmail & errorMsg coming in from form.
app.get('/', function(request, response) {
    response.render('home');
});

app.get('/register', function(request, response) {
    response.render('register'), {
        pgTitle: params.getPgTitle('register')
        //inpEmail: (request.session.inpEmail) ? request.session.inpEmail : false,
        //errorMsg: (request.session.errorMsg) ? request.session.errorMsg : false
    };
});



app.post('/register', function(request, response) {
    // save inputted variables in post request here.
    var email = request.body.inpEmail,
        password = request.body.password,
        password2 = request.body.password2;

    // Console log the inputted info.
    console.log("email: " + email + '\n' +
        "password: " + password + '\n' +
        "password2: " + password2);

    // Validate the params
    request.checkBody('inpEmail', 'Email is required').notEmpty();
    request.checkBody('inpEmail', 'Email is not valid').isEmail();
    request.checkBody('password', 'Password is required').notEmpty();
    request.checkBody('password2', 'Passwords do not match').equals(request.body.password);

    var errors = request.validationErrors();
    if (errors) {
        response.render('register', {
            errors: errors
        });
    } else {
        var inpEmail = request.body.inpEmail.trim(); // FRED - add server-side email verification
        request.session.inpEmail = inpEmail; // add email input to session memory

        Unconfirmed.findOne({
            userEmail: inpEmail
        }, '_id', function(err, user) {
            if (err) throw err;
            if (user) { // if email exists already, do not re-save
                console.log(user);
                if (!user.confirmed) // if email exists but is not confirmed
                    return response.redirect(303, '/resubmit'); // redirect to FRED!! -- create resubmit page
                else
                    return response.redirect(303, '/returnuser'); // if email exists and confirmed, redirect to returnuser
            }
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    var newUser = {
                        userEmail: inpEmail,
                        password: hash // Insert the hashed password.
                    };
                    console.log('pw-encrypted: ' + hash);
                    console.log(user); 
                    new Unconfirmed({ // add email to unconfirmedemails collec.
                        newUser // Send encrypted credentials to the db.
                    }).save();

                });
            });
            if (request.session.errorMsg) delete request.session.errorMsg;
            request.flash('success_msg', 'An email has been sent to your account.');
            response.redirect(303, '/thanks');
        });
    }
    // Captcha was removed to make POST request again.
    // CaptchaChek(request, response, credentials.secretKey, '/', dbSave); //captchacheck verification

});

app.get('/login', function(request, response) {
    response.render('login');
});

// Initialize passport for session logging here.
passport.use(new Strategy(
    function(email, password, done) {
        Confirmed.getUserByEmail(email, function(err, email) {
            if (err) {
                return done(err);
            }
            if (!email) {
                return done(null, false, {
                    message: 'Unknown email'
                });
            }
            //This is commented out for now since most confirmed users don't have PWs.
            Confirmed.comparePassword(password, Confirmed.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, Confirmed);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });

        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(function(id, done) {
    Confirmed.getUserById(id, function(err, user) {
        done(err, user);
    });
});


app.post('/login',
    passport.authenticate('basic', {
        successRedirect: '/',
        failureRedirect: 'login',
        failureFlash: true,
        session: false
    }),
    function(request, response) {
        response.redirect('/');
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
    response.render('resubmit', {
        pgTitle: params.getPgTitle('resubmit'),
        inpEmail: inpEmail,
    });
});

app.get('/thanks', function(request, response) {
    /*  // Code for mail SMTP. I'm commenting this out for now so that we can get
        // unconfirmed users into the db with the new Schema.
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
            emailSender.send(response, inpEmail, idNum); // send confirmation email
            response.render('thanks', {
                pgTitle: params.getPgTitle('thanks'),
                inpEmail: inpEmail,
            });
        };
        if (request.session.dbENum) {
            mailAndRender(request.session.dbENum);
        } else {
            Unconfirmed.findOne({
                userEmail: request.session.inpEmail
            }, '_id', function(err, user) { //get id of email input
                if (!user) {
                    return response.redirect(303, '/');
                }
                mailAndRender(user._id);
            });
        }
    */
    if (!request.session.inpEmail) {
        return response.session.redirect(303, '/register');
    }
    Unconfirmed.findOne({
        userEmail: request.session.inpEmail
    }, '_id', function(err, user) {
        // Retrieve the id of the inputted email.
        if (!user) {
            return response.redirect(303, '/register');
        }
        response.render('thanks', {
            pgTitle: params.getPgTitle('thanks'),
            inpEmail: request.session.inpEmail,
            dbENum: user._id
        });
    });
});

app.get('/confirm', function(request, response) { // Fred - add referrer page restriction to disable back button
    var unconfE;
    if (request.query.unconfE) {
        unconfE = request.query.unconfE; // id comes from GET request, if not, redirect to home page
    } else {
        return response.redirect(303, '/'); //FRED - create error page fo
    }
    Unconfirmed.findById(unconfE, function(err, dbEmail) {
        if (err) throw (err);
        // if there is no record, or the record has no email address, reject, send home
        if (!dbEmail || !dbEmail.userEmail) {
            return response.redirect(303, '/home');
        }
        if (dbEmail.confirmed) { // if id is unconfirmed, send to resubmit page (create it)
            request.session.confE = unconfE;
            return response.redirect(303, '/resubmit'); // I changed to /resubmit -- Nicholas
        }
        dbEmail.confirmed = true; // set email in unconfirmedemail as confirmed
        dbEmail.save(function(err) {
            if (err) throw err;
        });

        var newUser = new Confirmed({ // create new entry in confirmedemail collection
            email: dbEmail.userEmail,
            password: dbEmail.password // Testing to see if this works
        });
        newUser.save(function(err) {
            if (err) throw err;
            Confirmed.findOne({
                email: dbEmail.userEmail
            }, '_id', function(err, user) { // THIS SHOULD BE A PROMISE!!!!!
                if (err) throw err;
                request.session.surveyId = user._id; // this is the new id number in Confirmed, add to session mem for dosurvey
                delete request.session.unconfE;
                delete request.session.inpEmail;
                return response.render('confirm', {
                    pgTitle: params.getPgTitle('confirm')
                });
                // how to do a time-delayed redirect to the dosurvey page
            });
        });
    });
});

app.get('/dosurvey', function(request, response) { // Fred - add referrer page restriction to disable back button
    var surveyId;
    if (request.session.surveyId)
        surveyId = request.session.surveyId;
    else
        return response.redirect(303, '/');

    Confirmed.findById(surveyId, function(err, user) {
        if (err) console.log(err);
        // if there is no record, or the record has no email address, reject, send home
        if (!user || !user.email) return response.redirect(303, '/');
        response.render('dosurvey', {
            pgTitle: params.getPgTitle('dosurvey'),
            conEmail: user.email,
            params: params,
            inpForm: (request.session.inpForm) ? inpForm : false, //params for if SS validation sees a problem
            alarm: (request.session.alarm) ? alarm : false // this is for error code - serverside validation
        });
    });
});
app.post('/prosurvey', function(request, response) { //this function processes the form data, it does not render a page
    var surveyId;
    if (request.session.surveyId)
        surveyId = request.session.surveyId;
    else
        return response.redirect(303, '/');

    var passThru = true;
    var inpForm = {
        surveyDate: new Date // this isn't going through, check -FRED
    };
    for (var i = 0; i < params.getReqFieldLen(); i++) {
        inpForm[params.getReqField(i)] = request.body[params.getReqField(i)];
        passThru = (request.body[params.getReqField(i)] != ""); // if required fields are empty, do not passThru
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
        for (var i = 1; i < params.allFieldsMap.length; i++) { // start at index 1 since email (index 0) is already there.
            user[params.allFieldsMap[i]] = inpForm[params.allFieldsMap[i]];
        }
        user.save(function(err) {
            if (err) throw (err);
            request.session.dispForm = inpForm;
            if (request.session.alarm) delete request.session.alarm;
            response.redirect(303, '/shosurvey');
        });
    });
});
app.get('/shosurvey', function(request, response) { // add referrer page verification before entering page.
    if (!request.session.dispForm) {
        response.redirect(303, '/');
    }
    var dispForm = params.getResDisp(request.session.dispForm); //transform form input into layout for display-translate param codes
    response.render('shosurvey', {
        pgTitle: params.getPgTitle('shosurvey'),
        dispForm: dispForm
    });

    // Your time to shine right here Billy Billzzz!
});


app.get('/returnuser', function(request, response) { // this page for emails already confirmed, check if survey completed
    response.render('returnuser', {
        pgTitle: params.getPgTitle('returnuser'),
        inpEmail: request.session.inpEmail
    });
});

//error page functions
app.use(function(request, response) { // this for page not found error
    response.status(404);
    response.render('404', {
        layout: 'error'
    });
});
app.use(function(err, request, response, next) { // this for program/db error
    console.error(err.stack);
    response.status(500);
    response.render('500', {
        layout: 'error'
    });
});
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Cntrl-C to terminate.');
});
