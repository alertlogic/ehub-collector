const util = require('util');

var devConfig = require('./dev_config');
var azureFunction = require('../Updater/index');


// Local development query and body params
var debugQuery = {
    'code': 'This is the code'
};

var debugBody = {
    'name': 'Azure'
};

// Local development request object
var req = {
    originalUrl: 'http://original-azure-function-url',
    method: 'GET',
    query: debugQuery,
    headers: {
        connection: 'Keep-Alive',
        accept: 'application/json',
        host: 'original-azure-function-url',
        origin: 'https://functions.azure.com',
    },
    body: debugBody,
    rawBody: JSON.stringify(debugBody)
};

// Local development timer object
var timer = {
    isPastDue: false,
    last: '2017-08-03T13:30:00',
    next: '2017-08-03T13:45:00'
};

// Local development context
var debugContext = {
    invocationId: 'ID',
    bindings: {
        req
    },
    log: {
        error : function() {
            return console.log('ERROR:', util.format.apply(null, arguments));
        },
        warn : function() {
            return console.log('WARNING:', util.format.apply(null, arguments));
        },
        info : function() {
            return console.log('INFO:', util.format.apply(null, arguments));
        },
        verbose : function() {
            return console.log('VERBOSE:', util.format.apply(null, arguments));
        }
    },
    done: function () {
        console.log('Response:', this.res);
    },
    res: null
};

// Call the azureFunction locally with your testing params
azureFunction(debugContext, timer);

