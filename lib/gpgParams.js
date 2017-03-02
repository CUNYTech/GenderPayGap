//parameters for select boxes, except states
var rngAge = ['under 20', '21 to 25', '26 to 35', '35 to 45', '46 to 55', '56 to 64', 'over 65'];
var rngGender = ['female', 'male', 'trans-maleTofemale', 'trans-femaleTomale'];
var rngDuration = ['less than 6 mos', '6 mos to 1 yr', '1 to 2 yrs', '2 to 5 yrs', '5 to 15 yrs', '15 to 25 yrs', 'over 25 yrs'];
var rngSalary = ['$15,000 or less', '$15,000 to $25,000', '$25,000 to $35,000', '$35,000 to $50,000', '$50,000 to $75,000', 
               '$75,000 to $100,000', '$100,000 to $175,000', 'over $175,000'];
var rngEthnic = ['White', 'Black', 'Native American/Alaskan', 'Chinese', 'Japanese', 'Filipino', 'Korean', 'Asian Indian', 'Vietnamese', 
             'Other East Asian', 'Middle Eastern', 'North African', 'South African', 'Pacific Islander', 'Mexican', 'Cuban', 'Puerto Rican', 'South/Central American', 'Other Hispanic'];

//get methods for select box parameters, except states
exports.getRngAge = function() {
    return rngAge;
};
exports.getRngSalary = function() {
    return rngSalary;
};
exports.getRngGender = function() {
    return rngGender;
};
exports.getRngDuration = function() {
    return rngDuration;
}
exports.getRngEthnic = function() {
    return rngEthnic;
};

//states for select box
var rngStates = { 
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
exports.getRngStates = function() {
    return rngStates;
};
