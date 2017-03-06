var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(require('body-parser')());
var credentials = require('./credentials.js');      // remember to set your credentials.js file 
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());
var params = require('./lib/gpgParams.js');

/*  the two lines are for mocha/chai testing
    app.use(function(request, response, next) {
    response.locals.showTests = app.get('env') !== 'production' && request.query.test === '1';
    next();
}); */
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
   response.render('home', {pgTitle: params.getPgTitle('home') });
});
app.post('/', function(request, response) {
    var inpEmail = request.body.inpEmail;                       // add server-side verification
    // add db verification and add email to emailpending collection
    // redirect to different page if email is in db already
    // var dbENum = [pending email collection id num];                                                
    // request.session.dbENum = dbENum; 
    request.session.inpEmail = inpEmail;                       
    response.redirect(303, '/thanks');
});
app.get('/thanks', function(request, response) {
    response.render('thanks', {pgTitle: params.getPgTitle('thanks'), 
                               inpEmail: request.session.inpEmail          //, dbENum: request.sesssion.dbENum
                                }); 
});
app.get('/confirm', function(request, response) {
    inpEmail = request.query.inpEmail;                // add verification that db has confirmed db num and email exist.
                                                      //  if db can't confirm number, redirect to redirect page    
    request.session.conEmail = inpEmail;              //  this will change to db generated email address once confirmed
    response.render('confirm', {pgTitle: params.getPgTitle('confirm') });
    // how to do a time-delayed redirect to the dosurvey page
});
app.get('/dosurvey', function(request, response) {          // add referrer page restriction to disable back button
    response.render('dosurvey', {pgTitle: params.getPgTitle('dosurvey'), 
                                conEmail: request.session.conEmail,             
                                params: params /*,
                                inpForm: request.session.inpForm,    //params for validation failure
                                alarm: (!request.session.passThru) */ });
});
app.post('/prosurvey', function(request, response) {
    var passThru = true;
    var inpForm = {
        email: request.session.inpEmail
    };
    for (var i = 0; i < params.getReqFieldLen(); i++) {
        inpForm[params.getReqField(i)] = request.body[params.getReqField(i)];
        passThru = (request.body[params.getReqField(i)] != "");                         // add more verification
    }
    if (!passThru) {
        request.session.inpForm = inpForm;
        request.session.passThru = passThru;
        return response.redirect(303, '/dosurvey');
    }
    for (var i = 0; i < params.getNonReqFieldLen(); i++) {
        inpForm[params.getNonReqField(i)] = request.body[params.getNonReqField(i)];
    }
                                                        // add- filter scrub form data for special characters
                                                        // add form data to db here
    request.session.proForm = inpForm;
    if (request.session.passThru) delete request.sesion.passThru;
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
