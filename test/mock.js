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


var context = function(done) {
    return {
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
        done: function (result) {
            console.log('Done.', result);
            done();
        },
        res: null
    };
};


var timer = {
    isPastDue: false,
    last: '2017-08-03T13:30:00',
    next: '2017-08-03T13:45:00'
};

const AL_CID = '12345678';
const AL_TOKEN_TTL = 21600; //6 hours

function getAuthResp() {
    return {
        authentication : {
            token : 'token',
            account : {
                id : AL_CID
            },
            token_expiration : Math.ceil(Date.now()/1000 + AL_TOKEN_TTL)
        }
    };
}

const ACTIVITY_LOG_RECORD = {
    "channels": "Operation",
    "correlationId": "2410a782-fc66-4892-ae23-6dbc27c6ad92",
    "description": "A new recommendation is available.",
    "eventDataId": "6ce90dff-2697-4b89-9b42-67d925fc8c8c",
    "eventName": {
        "value": "",
        "localizedValue": ""
    },
    "category": {
        "value": "Recommendation",
        "localizedValue": "Recommendation"
    },
    "eventTimestamp": "2018-12-19T08:18:21.1834546Z",
    "id": "/SUBSCRIPTIONS/05DCD414-C680-4F2C-8716-058CD058974B/RESOURCEGROUPS/KKTESTEHUB/PROVIDERS/MICROSOFT.STORAGE/STORAGEACCOUNTS/KKTESTEHUB/events/6ce90dff-2697-4b89-9b42-67d925fc8c8c/ticks/636808043011834546",
    "level": "Informational",
    "operationId": "",
    "operationName": {
        "value": "Microsoft.Advisor/recommendations/available/action",
        "localizedValue": "New recommendation is available"
    },
    "resourceGroupName": "KKTESTEHUB",
    "resourceProviderName": {
        "value": "MICROSOFT.STORAGE",
        "localizedValue": "MICROSOFT.STORAGE"
    },
    "resourceType": {
        "value": "MICROSOFT.STORAGE/storageaccounts",
        "localizedValue": "MICROSOFT.STORAGE/storageaccounts"
    },
    "resourceId": "/SUBSCRIPTIONS/05DCD414-C680-4F2C-8716-058CD058974B/RESOURCEGROUPS/KKTESTEHUB/PROVIDERS/MICROSOFT.STORAGE/STORAGEACCOUNTS/KKTESTEHUB",
    "status": {
        "value": "Active",
        "localizedValue": "Active"
    },
    "subStatus": {
        "value": "",
        "localizedValue": ""
    },
    "submissionTimestamp": "2018-12-19T08:18:21.1834546Z",
    "subscriptionId": "05DCD414-C680-4F2C-8716-058CD058974B",
    "properties": {
        "recommendationSchemaVersion": "1.0",
        "recommendationCategory": "HighAvailability",
        "recommendationImpact": "Medium",
        "recommendationName": "Enable Soft Delete to protect your blob data",
        "recommendationResourceLink": "https://portal.azure.com/#blade/Microsoft_Azure_Expert/AdvisorBlade/category/HighAvailability/source/ActivityLog",
        "recommendationType": "42dbf883-9e4b-4f84-9da4-232b87c4b5e9"
    },
    "relatedEvents": []
};

module.exports = {
    context: context,
    timer: timer,
    ACTIVITY_LOG_RECORD: ACTIVITY_LOG_RECORD,
    getAuthResp: getAuthResp,
    AL_CID: AL_CID
};
