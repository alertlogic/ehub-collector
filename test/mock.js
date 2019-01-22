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
        invocationId: 'invocationID',
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

const AUDIT_LOG_RECORD = {
    "time": "2018-12-10T00:03:46.6161822Z",
    "resourceId": "/tenants/7918d4b5-0442-4a97-be2d-36f9f9962ece/providers/Microsoft.aadiam",
    "operationName": "Update policy",
    "operationVersion": "1.0",
    "category": "AuditLogs",
    "tenantId": "7918d4b5-0442-4a97-be2d-36f9f9962ece",
    "resultSignature": "None",
    "durationMs": 0,
    "callerIpAddress": "<null>",
    "correlationId": "192298c1-0994-4dd6-b05a-a6c5984c31cb",
    "identity": "MS-PIM",
    "level": "Informational",
    "properties": {
        "id": "Directory_VNXV4_28148892",
        "category": "Policy",
        "correlationId": "192298c1-0994-4dd6-b05a-a6c5984c31cb",
        "result": 0,
        "resultReason": "",
        "activityDisplayName": "Update policy",
        "activityDateTime": "2018-12-10T00:03:46.6161822+00:00",
        "loggedByService": "Core Directory",
        "operationType": "Update",
        "initiatedBy": {},
        "targetResources": [
        {
            "id": "5e7a8ae7-165d-44a4-a4f4-6141f8c8ef40",
            "displayName": "Default Policy",
            "type": "Policy",
            "modifiedProperties": []
        }
        ],
        "additionalDetails": []
    }
};

const O365_RECORD = {
      "ApplicationId": "c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
      "TargetContextId": "bf8d32d3-1c13-4487-af02-80dba2236485",
      "Target": [
        {
          "Type": 0,
          "ID": "797f4846-ba00-4fd7-ba43-dac1f8f63013"
        }
      ],
      "IntraSystemId": "c177a031-d063-4789-873d-87af94762900",
      "InterSystemsId": "a9eccaf4-84f7-47c4-99f4-f3989bd1899a",
      "ActorIpAddress": "87.113.76.58",
      "ActorContextId": "bf8d32d3-1c13-4487-af02-80dba2236485",
      "UserType": 0,
      "UserKey": "10030000A19F1B13@alazurealertlogic.onmicrosoft.com",
      "ResultStatus": "Succeeded",
      "RecordType": 15,
      "OrganizationId": "bf8d32d3-1c13-4487-af02-80dba2236485",
      "Operation": "UserLoggedIn",
      "Id": "425415ab-86e9-4ae1-b91f-61d748d2a812",
      "CreationTime": "2018-03-21T17:00:32",
      "Version": 1,
      "Workload": "AzureActiveDirectory",
      "ClientIP": "87.113.76.58",
      "ObjectId": "797f4846-ba00-4fd7-ba43-dac1f8f63013",
      "UserId": "kkuzmin@alazurealertlogic.onmicrosoft.com",
      "AzureActiveDirectoryEventType": 1,
      "ExtendedProperties": [
        {
          "Value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
          "Name": "UserAgent"
        },
        {
          "Value": "1",
          "Name": "UserAuthenticationMethod"
        },
        {
          "Value": "OAuth2:Authorize",
          "Name": "RequestType"
        },
        {
          "Value": "Success",
          "Name": "ResultStatusDetail"
        },
        {
          "Value": "True",
          "Name": "KeepMeSignedIn"
        }
      ],
      "Actor": [
        {
          "Type": 0,
          "ID": "bea5cb4c-0348-49e4-b225-8acf2623d1ea"
        },
        {
          "Type": 5,
          "ID": "kkuzmin@alazurealertlogic.onmicrosoft.com"
        },
        {
          "Type": 3,
          "ID": "10030000A19F1B13"
        }
      ]
};

const AZURE_GET_EHUB_NS = function(ehubNsState = 'Succeeded') {
    return {
      "sku": {
        "name": "Standard",
        "tier": "Standard",
        "capacity": 1
      },
      "id": "/subscriptions/05dcd414-c680-4f2c-8716-058cd058974b/resourceGroups/rcs-master-ehub/providers/Microsoft.EventHub/namespaces/AlertLogicIngest-westeurope-pcmpl7iir6xxk",
      "name": "AlertLogicIngest-westeurope-pcmpl7iir6xxk",
      "type": "Microsoft.EventHub/Namespaces",
      "location": "West Europe",
      "tags": {},
      "properties": {
        "isAutoInflateEnabled": true,
        "maximumThroughputUnits": 16,
        "kafkaEnabled": false,
        "provisioningState": ehubNsState,
        "metricId": "05dcd414-c680-4f2c-8716-058cd058974b:alertlogicingest-westeurope-pcmpl7iir6xxk",
        "createdAt": "2019-01-16T12:06:07.107Z",
        "updatedAt": "2019-01-16T12:06:31.82Z",
        "serviceBusEndpoint": "https://AlertLogicIngest-westeurope-pcmpl7iir6xxk.servicebus.windows.net:443/",
        "status": "Active"
      }
    };
};

const AZURE_LIST_EVENT_HUBS = function(ehubStatus = 'Active') {
    return {
      "value": [
        {
          "id": "/subscriptions/05dcd414-c680-4f2c-8716-058cd058974b/resourceGroups/rcs-master-ehub/providers/Microsoft.EventHub/namespaces/AlertLogicIngest-westeurope-pcmpl7iir6xxk/eventhubs/alertlogic-log",
          "name": "alertlogic-log",
          "type": "Microsoft.EventHub/Namespaces/EventHubs",
          "location": "West Europe",
          "properties": {
            "messageRetentionInDays": 7,
            "partitionCount": 4,
            "status": ehubStatus,
            "createdAt": "2019-01-16T12:06:46.267",
            "updatedAt": "2019-01-16T12:06:46.643",
            "partitionIds": [
              "0",
              "1",
              "2",
              "3"
            ]
          }
        }
      ]
    };
};

const AZURE_RESOURCE_NOT_FOUND = {
    "error": {
        "code": "ResourceNotFound",
        "message": "The Resource 'Microsoft.EventHub/namespaces/AlertLogicIngest-westeurope-pcmpl7iir6xx' under resource group 'rcs-master-ehub' was not found."
      }
    };

const AZURE_TOKEN_MOCK = {
    'token_type' : 'Bearer',
    'expires_in' : 3599,
    'ext_expires_in' : 3599,
    'expires_on' : '1543401497',
    'not_before' :'1543401497',
    'resource' : 'https://management.azure.com',
    'access_token' :  'some-token'
};

module.exports = {
    context: context,
    timer: timer,
    ACTIVITY_LOG_RECORD: ACTIVITY_LOG_RECORD,
    AUDIT_LOG_RECORD: AUDIT_LOG_RECORD,
    O365_RECORD: O365_RECORD,
    getAuthResp: getAuthResp,
    AL_CID: AL_CID,
    AZURE_GET_EHUB_NS: AZURE_GET_EHUB_NS,
    AZURE_LIST_EVENT_HUBS: AZURE_LIST_EVENT_HUBS,
    AZURE_TOKEN_MOCK: AZURE_TOKEN_MOCK,
    AZURE_RESOURCE_NOT_FOUND: AZURE_RESOURCE_NOT_FOUND
};
