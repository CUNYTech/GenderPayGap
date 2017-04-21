//webpage titles - all pages that display html/handlebars
var pgTitle = {
    home: 'Welcome to EqualityPay!',
    thanks: 'Confirming your email!',
    confirm: 'We are ready to go!',
    dosurvey: 'Please fill out the form',
    shosurvey: 'Your survey results',
    resubmit: 'Re-confirm your email',
    returnuser: 'You\'ve been here before!',
};
exports.getPgTitle = function(page) {
    return pgTitle[page];
};
// Parameters for select boxes, except states - dosurvey.handlebars
var ageRange = ['under 20', '21 to 25', '26 to 35', '35 to 45', '46 to 55', '56 to 64', 'over 65'];
var gender = ['female', 'male', 'gender neutral', 'gender non-conforming'];
var empDuration = ['less than 6 mos', '6 mos to 1 yr', '1 to 2 yrs', '2 to 5 yrs', '5 to 15 yrs', '15 to 25 yrs', 'over 25 yrs'];
var empSalary = ['<= $10,000', '$20,000', '$30,000', '$40,000', '$50,000',
    '$60,000', '$70,000', '$80,000', '$90,000', '$100,000', '>= $110,000'
];
var ethnicity = ['White', 'Black', 'Native American/Alaskan', 'Chinese', 'Japanese', 'Filipino', 'Korean', 'Asian Indian', 'Vietnamese',
    'Other East Asian', 'Middle Eastern', 'North African', 'South African', 'Pacific Islander', 'Mexican', 'Cuban', 'Puerto Rican', 'South/Central American', 'Other Hispanic'
];

var rngField = ['ageRange', 'gender', 'empDuration', 'empSalary'];
var rngObj = [ageRange, gender, empDuration, empSalary];
var reqField = ['employer', 'empState', 'empTitle', rngField[0], rngField[1], rngField[2], rngField[3]];
var nonReqField = ['userName', 'ethnicity'];

// for the survey form results display page - shosurvey.handlebars
var resDisp = {
    map: ['email', nonReqField[0], rngField[0], rngField[1], nonReqField[1], reqField[0], reqField[1], reqField[2],
        rngField[2], rngField[3]
    ],
    lbl: ['Email', 'Your name', 'Your Age Range', 'Your Gender', 'Race/Ethnicity', 'Employer Name', 'State of Employer',
        'Your Title/Position', 'Length of Employment', 'Salary Range'
    ]
};
//fields for db input - confirmed.js not sure why getter methods are not working for these.
var allFieldsMap = ['email', nonReqField[0], rngField[0], rngField[1], nonReqField[1], reqField[0], reqField[1],
    reqField[2], rngField[2], rngField[3]
];

var allFieldsType = ['String', 'String', 'Number', 'Number', 'String', 'String', 'String', 'String', 'Number', 'Number'];

//get methods for select box parameters, except states - dosurvey.handlebars
exports.getAgeRange = function() {
    return ageRange;
};
exports.getTheAgeRange = function(num) {
    return ageRange[num];
};
exports.getEmpSalary = function() {
    return empSalary;
};
exports.getSalaryValue = function(position){
    return empSalary[position];
};
exports.getGender = function() {
    return gender;
};
exports.getEmpDuration = function() {
    return empDuration;
};
exports.getEthnicity = function() {
    return ethnicity;
};

// get methods for inpForm data
exports.getReqFieldLen = function() {
    return reqField.length;
};
exports.getReqField = function(num) {
    return reqField[num];
};
exports.getNonReqFieldLen = function() {
    return nonReqField.length;
};
exports.getNonReqField = function(num) {
    return nonReqField[num];
};

// getter method for form results display - shosurvey.handlebars
exports.getResDisp = function(inpObj) {
    for (var i = 0; i < rngField.length; i++) { // takes each field that has a range and interprets that range
        inpObj[rngField[i]] = rngObj[i][inpObj[rngField[i]]];
    }
    var disp = {};
    for (var i = 0; i < resDisp.map.length; i++) {
        disp[resDisp.lbl[i]] = inpObj[resDisp.map[i]];
    }
    return disp;
};

exports.getLocation = function(userInp){
    var obj = {};
    obj[resDisp.lbl[7]] = userInp[resDisp.map[7]];
    return obj;
};

//get methods for allFields variable for db input - confirmed.js they are not working though. check later
exports.getAllFieldsLen = function() {
    return allFieldsMap.length;
};
exports.getAllFieldsMap = function(num) {
    return allFieldsMap[num];
};
exports.getAllFieldsType = function(num) {
    return allFieldsType[num];
};

// Dictionary!!!! States for select box - dosurvey.handlebars
var empState = {
    AL: 'Alabama',
    AK: 'Alaska',
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
};

var stateCode = {
    AL:'01',
    AK:'02',
    AZ:'04',
    AR:'05',
    CA:'06',
    CO:'08',
    CT:'09',
    DE:'10',
    DC:'11',
    FL:'12',
    GA:'13',
    HI:'15',
    ID:'16',
    IL:'17',
    IN:'18',
    IA:'19',
    KS:'20',
    KY:'21',
    LA:'22',
    ME:'23',
    MD:'24',
    MA:'25',
    MI:'26',
    MN:'27',
    MS:'28',
    MO:'29',
    MT:'30',
    NE:'31',
    NV:'32',
    NH:'33',
    NJ:'34',
    NM:'35',
    NY:'36',
    NC:'37',
    ND:'38',
    OH:'39',
    OK:'40',
    OR:'41',
    PA:'42',
    RI:'44',
    SC:'45',
    SD:'46',
    TN:'47',
    TX:'48',
    UT:'49',
    VT:'50',
    VA:'51',
    WA:'53',
    WV:'54',
    WI:'55',
    WY:'56',
    GU:'66',
    PR:'72',
    VI:'78'
};

var metropolitanAreas = {
    01: ['0011500','0012220','0013820','0019300', '0019460','0020020','0022520','0023460','0026620','0033660','0033860','0046220','0100001','0100002','0100003','0100004'],
    02: ['0011260', '0021820', '0200001','0200002'],
    04: ['0022380', '0029420', '0038060', '0039140', '0043420', '0046060', '0049740', '0400001'],
    05: ['0022220', '0022900', '0026300', '0027860', '0030780', '0038220', '0500001', '0500002', '0500003', '0500004'],
    06: ['0011244', '0012540', '0017020', '0020940', '0023420', '0025260', '0031080', '0031084', '0031460', '0032900', '0033700', '0034900', '0036084', '0037100', '0039820', '0040140', '0040900', '0041500', '0041740', '0041860', '0041884', '0041940', '0042020', '0042034', '0042100', '0042200', '0042220', '0044700', '0046700', '0047300', '0049700', '0600001', '0600002', '0600003', '0600004', '0600005'], 
    08: ['00114500', '0017820', '0019740', '0022660', '0024300', '0024540', '0039380', '0800001', '0800002', '0800003'],
    09: ['0071950', '0072850', '0073450', '0075700', '0076450', '0078700', '0900001'],
    10: ['0020100', '0048864'],
    11: ['0047894', '0047900'],
    12: ['0015980', '0018880', '0019660', '0022744', '0023540', '0026140', '0027260', '0029460', '0033100', '0033124', '0034940', '0035840', '0036100', '0036740', '0037340', '0037460', '0037860', '0038940', '0039460', '0042680', '0042700', '0045220', '0045300', '0045540', '0048424', '1200001', '1200002', '1200003'],
    13: ['0010500', '0012020', '0012060', '0012260', '0015260', '0017980', '0019140', '0023580', '0025980', '0031420', '0040660', '0042340', '0046660', '0047580', '1300002', '1300003', '1300004'],
    15: ['0027980', '0046520', '1500001'],
    16: ['0014260', '0017660', '0026820', '0030300', '0038540', '1600001', '1600002', '1600003', '1600004'],
    17: ['0014010', '0016060', '0016580', '0016974', '0016980', '0019180', '0019500', '0020994', '0028100', '0029404', '0037900', '0040420', '0044100', '1700001', '1700002', '1700003', '1700004'],
    18: ['0014020', '0018020', '0021140', '0021780', '0023060', '0023844', '0026900', '0029020', '0029200', '0033140', '0034620', '0043780', '0045460', '1800001', '1800002', '1800003'],
    19: ['0011180', '0016300', '0019340', '0019780', '0020220', '0026980', '0043580', '0049740', '1900001', '1900002', '1900003', '1900004'],
    20: ['0029940', '0031740', '0045820', '0048620', '2000001', '2000002', '2000003', '2000004'],
    21: ['0014540', '0021060', '0030460', '0031140', '0036980', '2100001', '2100002', '2100003', '2100004'],
    22: ['0010780', '0012940', '0025220', '0026380', '0029180', '0029340', '0033740', '0035380', '0043340', '2200001', '2200002', '2200003', '2200004'],
    23: ['0070750', '0074650', '0076700', '2300001', '2300002'],
    24: ['0012580', '0015680', '0019060', '0025180', '0041540', '0043524', '2400001', '2400002'],
    25: ['0070900', '0071650', '0071654', '0072104', '0073104', '0073504', '0074204', '0074500', '0074804', '0074854', '0075550', '0076524', '0076600', '0078100', '0078254', '0079600', '2500001', '2500002', '2500003', '2500004'],
    26: ['0011460', '0012980', '0013020', '0019804', '0019820', '0022420', '0024340', '0027100', '0028020', '0029620', '0033220', '0033780', '0034740', '0035660', '0040980', '0047664', '2600001', '2600002', '2600003', '2600004'],
    27: ['0020260', '0031860', '0033460', '0040340', '0041060', '2700001', '2700002', '2700003', '2700004'],
    28: ['0025060', '0025620', '0027140', '2800001', '2800002', '2800003', '2800004'],
    29: ['0016020', '0017860', '0027620', '0027900', '0028140', '0041140', '0041180', '0044180', '2900001', '2900002', '2900003', '2900004'],
    30: ['0013740', '0024500', '0033540', '3000001', '3000002', '3000003', '3000004'],
    31: ['0024260', '0030700', '0036540', '3100001', '3100002', '3100003', '3100004'],
    32: ['0016180', '0029820', '0039900', '3200001', '3200002'],
    33: ['0073050', '0074950', '0075404', '0076900', '3300001', '3300002', '3300003', '3300004'],
    34: ['0012100', '0015804', '0035084', '0036140', '0045940', '0047220'],
    35: ['0010740', '0022140', '0029740', '0042140', '3500001', '3500002', '3500003', '3500004'],
    36: ['0010580', '0013780', '0015380', '0020524', '0021300', '0024020', '0027060', '0028740', '0035004', '0035614', '0035620', '0040380', '0045060', '0046540', '0048060', '3600001', '3600002', '3600003', '3600004'],
    37: ['0011700', '0015500', '0016740', '0020500', '0022180', '0024140', '0024660', '0024780', '0025860', '0027340', '0035100', '0039580', '0040580', '0048900', '0049180', '3700001', '3700002', '3700003', '3700004'],
    38: ['0013900', '0022020', '0024220', '3800001', '3800002', '3800003', '3800004'],
    39: ['0010420', '0015940', '0017140', '0017460', '0018140', '0019380', '0030620', '0031900', '0044220', '0045780', '0049660', '3900001', '3900002', '3900003', '3900004'],
    40: ['0030020', '0036420', '0046140', '4000001', '4000002', '4000003', '4000004'],
    41: ['0010540', '0013460', '0018700', '0021660', '0024420', '0032780', '0038900', '0041420', '4100001', '4100002', '4100003', '4100004'],
    42: ['0010900', '0011020', '0014100', '0016540', '0020700', '0021500', '0023900', '0025420', '0027780', '0029540', '0030140', '0033874', '0037964', '0037980', '0038300', '0039740', '0042540', '0044300', '0048700', '0049620', '4200001', '4200002', '4200003'],
    44: ['0077200', '4400001'],
    45: ['0016700', '0017900', '0022500', '0024860', '0025940', '0034820', '0043900', '0044940', '4500001', '4500002', '4500003', '4500004'],
    46: ['0039660', '0043620', '4600002', '4600003'],
    47: ['0016860', '0017300', '0017420', '0027180', '0027740', '0028700', '0028940', '0032820', '0034100', '0034980', '4700001', '4700002', '4700003', '4700004'],
    48: ['0010180', '0011100', '0012420', '0013140', '0015180', '0017780', '0018580', '0019100', '0019124', '0021340', '0023104', '0026420', '0028660', '0029700', '0030980', '0031180', '0032580', '0033260', '0036220', '0041660', '0041700', '0043300', '0045500', '0046340', '0047020', '0047380', '0048660', '4800001', '4800002', '4800003', '4800004'],
    49: ['0030860', '0036260', '0039340', '0041100', '0041620', '4900001', '4900002', '4900003', '4900004'],
    50: ['5000001', '5000002'],
    51: ['0013980', '0016820', '0025500', '0031340', '0040060', '0040220', '00444420', '0047260', '0049020', '5100001', '5100002', '5100003', '5100004'],
    53: ['0013380', '0014740', '0028420', '0031020', '0034580', '0036500', '0042644', '0042660', '0044060', '0045104', '0047460', '0048300', '0049420', '5300001', '5300002', '5300003', '5300004'],
    54: ['0013220', '0016620', '0026580', '0034060', '0037620', '0048260', '0048540', '5400001', '5400002'],
    55: ['0011540', '0020740', '0022540', '0024580', '0027500', '0029100', '0031540', '0033340', '0036780', '0039540', '0043100', '0048140', '5500001', '5500002', '5500003', '5500004'],
    56: ['0016220', '0016940', '5600001', '5600002', '5600003', '5600004'],
    66: ['6600000'],
    72: ['0010380', '0011640', '0025020', '0032420', '0038660', '0041900', '0041980', '7200001', '7200002'],
    78: ['7800000']

};

exports.getStateCode = function (stateAbb){
    return stateCode[stateAbb];
};


exports.getMetroArea = function(code){
    var metroAreas = [];
            console.log("this is the state code: " + code);

    if(metropolitanAreas.hasOwnProperty(code)){
        for(var i = 0; i < metropolitanAreas[code].length; i++){
            metroAreas.push(metropolitanAreas[code][i]);
            console.log("metrooAreas " + metroAreas[i]);
        }
    }
    return metroAreas;
};

exports.getEmpState = function() {
    return empState;
};

exports.matchStateByAbb = function(abb) {
    return empState[abb];
};
