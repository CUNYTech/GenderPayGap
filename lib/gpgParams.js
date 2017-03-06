//webpage titles - all pages that display html/handlebars
var pgTitle = {
    home:       'Welcome to EqualityPay!',
    thanks:     'Confirming your email!',
    confirm:    'We are ready to go!',
    dosurvey:   'Please fill out the form',
    shosurvey:  'Your survey results'
};
exports.getPgTitle = function(page) {
    return pgTitle[page];
}
//parameters for select boxes, except states - dosurvey.handlebars
var ageRange = ['under 20', '21 to 25', '26 to 35', '35 to 45', '46 to 55', '56 to 64', 'over 65'];
var gender = ['female', 'male', 'trans-maleTofemale', 'trans-femaleTomale'];
var empDuration = ['less than 6 mos', '6 mos to 1 yr', '1 to 2 yrs', '2 to 5 yrs', '5 to 15 yrs', '15 to 25 yrs', 'over 25 yrs'];
var empSalary = ['$15,000 or less', '$15,000 to $25,000', '$25,000 to $35,000', '$35,000 to $50,000', '$50,000 to $75,000', 
               '$75,000 to $100,000', '$100,000 to $175,000', 'over $175,000'];
var ethnicity = ['White', 'Black', 'Native American/Alaskan', 'Chinese', 'Japanese', 'Filipino', 'Korean', 'Asian Indian', 'Vietnamese', 
             'Other East Asian', 'Middle Eastern', 'North African', 'South African', 'Pacific Islander', 'Mexican', 'Cuban', 'Puerto Rican', 'South/Central American', 'Other Hispanic'];

var rngField = ['ageRange', 'gender', 'empDuration', 'empSalary', 'ethnicity'];
var rngObj = [ageRange, gender, empDuration, empSalary, ethnicity];
var reqField = ['employer', 'empState', rngField[0], rngField[1], rngField[2], rngField[3]];
var nonReqField = ['userName', rngField[4]];

// for the survey form results display page - shosurvey.handlebars
var resDisp = {
    map:    ['email', nonReqField[0], rngField[0], rngField[1], rngField[4], reqField[0], reqField[1], 
             rngField[2], rngField[3] ],
    lbl:    ['Email', 'Your name', 'Your Age Range', 'Your Gender', 'Race/Ethnicity', 'Employer Name', 'State of Employer',
             'Length of Employment', 'Salary Range' ]
};
exports.getResDisp = function(inpObj) {
    for (var i = 0; i < rngField.length; i++) {             // takes each field that has a range and interprets that range
        inpObj[rngField[i]] = rngObj[i][inpObj[rngField[i]]];    
    } 
    var disp = {};
    for (var i = 0; i < resDisp.map.length; i++) {
        disp[resDisp.lbl[i]] = inpObj[resDisp.map[i]];
    }
    return disp;
};

//get methods for select box parameters, except states - dosurvey.handlebars
exports.getAgeRange = function() {
    return ageRange;
};
exports.getEmpSalary = function() {
    return empSalary;
};
exports.getGender = function() {
    return gender;
};
exports.getEmpDuration = function() {
    return empDuration;
}
exports.getEthnicity = function() {
    return ethnicity;
};

// get methods for inpForm data 
exports.getReqFieldLen = function() {
  return reqField.length;  
};
exports.getReqField = function(num) {
    return reqField[num];  
}
exports.getNonReqFieldLen = function() {
  return nonReqField.length;  
};
exports.getNonReqField = function(num) {
    return nonReqField[num];  
}

//states for select box - dosurvey.handlebars
var empState = { 
    AL: 'Alabama',
    AK: 'Alaska',
    AS: 'American Samoa',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'District of Columbia',
    FL: 'Florida',
    GA: 'Georgia',
    GU: 'Guam',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    PR: 'Puerto Rico',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VI: 'Virgin Islands',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming'
}
exports.getEmpState = function() {
    return empState;
};
