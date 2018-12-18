/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 * 
 * Mocks for unit testing.
 * 
 * @end
 * -----------------------------------------------------------------------------
 */
 
const util = require('util');

process.env.WEBSITE_HOSTNAME = 'kkuzmin-app-ehub.azurewebsites.net';
process.env.WEBSITE_SITE_NAME = 'kkuzmin-app-ehub.azurewebsites.net';
process.env.TMP = '/tmp/';
process.env.APP_SUBSCRIPTION_ID = 'subscription-id';
process.env.CUSTOMCONNSTR_APP_CLIENT_ID = 'client-id';
process.env.CUSTOMCONNSTR_APP_CLIENT_SECRET = 'client-secret';
process.env.CUSTOMCONNSTR_APP_CI_ACCESS_KEY_ID = 'ci-access-key-id';
process.env.CUSTOMCONNSTR_APP_CI_SECRET_KEY = 'ci-secret-key';
process.env.APP_TENANT_ID = '111132d3-1c13-4487-af02-80dba2236485';
process.env.APP_RESOURCE_GROUP = 'resource-group';
process.env.COLLECTOR_HOST_ID = 'collector-host-id';
process.env.COLLECTOR_SOURCE_ID = 'collector-source-id';
process.env.CUSTOMCONNSTR_APP_AL_RESIDENCY = 'default';
process.env.CUSTOMCONNSTR_APP_AL_API_ENDPOINT = 'al-api-endpoint';
process.env.AzureWebJobsStorage = 'DefaultEndpointsProtocol=https;AccountName=testappo365;AccountKey=S0meKey+';


var context = {
    invocationId: 'ID',
    bindings: {
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
        console.log('Test response:');
    },
    res: null
};


var timer = {
    isPastDue: false,
    last: '2017-08-03T13:30:00',
    next: '2017-08-03T13:45:00'
};


module.exports = {
    context : context,
    timer : timer
};
