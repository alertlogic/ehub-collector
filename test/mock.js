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
process.env.APP_DL_CONTAINER_NAME = 'alertlogic-dl';


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

const SQL_AUDIT_LOG_RECORD = {
    "properties": {
        "is_server_level_audit": "false",
        "data_sensitivity_information": "",
        "application_name": "Azure SQL Query Editor",
        "user_defined_information": "",
        "additional_information": "",
        "statement": "",
        "object_name": "kktestsql",
        "schema_name": "",
        "database_name": "kktestsql",
        "affected_rows": 0,
        "response_rows": 0,
        "duration_milliseconds": 0,
        "transaction_id": 0,
        "user_defined_event_id": 0,
        "object_id": 5,
        "target_database_principal_id": 0,
        "target_server_principal_id": 0,
        "audit_schema_version": 1,
        "event_time": "2019-01-22T21:21:19.734Z",
        "sequence_number": 1,
        "succeeded": "true",
        "is_column_permission": "false",
        "session_id": 127,
        "server_principal_id": 0,
        "database_principal_id": 1,
        "action_id": "DBAS",
        "action_name": "DATABASE AUTHENTICATION SUCCEEDED",
        "class_type": "DB",
        "class_type_description": "DATABASE",
        "securable_class_type": "DATABASE",
        "client_ip": "104.40.130.216",
        "permission_bitmask": "0x00000000000000000000000000000000",
        "sequence_group_id": "3D7C524F-6658-42C4-8C5C-EF6CDE657481",
        "session_server_principal_name": "kkuzmin",
        "server_principal_name": "kkuzmin",
        "server_principal_sid": "0x0106000000000164000000000000000071DB52980FE6574ABF82FA2619C6464E",
        "database_principal_name": "dbo",
        "target_server_principal_name": "",
        "target_server_principal_sid": "",
        "target_database_principal_name": "",
        "server_instance_name": "kktest-sql-us"
      },
      "operationName": "AuditEvent",
      "category": "SQLSecurityAuditEvents",
      "resourceId": "/SUBSCRIPTIONS/05DCD414-C680-4F2C-8716-058CD058974B/RESOURCEGROUPS/KKTESTEHUB/PROVIDERS/MICROSOFT.SQL/SERVERS/KKTEST-SQL-US/DATABASES/KKTESTSQL",
      "time": "2019-01-22T21:21:26.844Z",
      "ResourceGroup": "kktestehub",
      "SubscriptionId": "05dcd414-c680-4f2c-8716-058cd058974b",
      "LogicalServerName": "kktest-sql-us"
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
        },
        {
            "id": "/subscriptions/05dcd414-c680-4f2c-8716-058cd058974b/resourceGroups/rcs-master-ehub/providers/Microsoft.EventHub/namespaces/AlertLogicIngest-westeurope-pcmpl7iir6xxk/eventhubs/insights-operational-log",
            "name": "insights-operational-log",
            "type": "Microsoft.EventHub/Namespaces/EventHubs",
            "location": "West Europe",
            "properties": {
              "messageRetentionInDays": 7,
              "partitionCount": 4,
              "status": "Active",
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

const LIST_CONTAINER_BLOBS = function(blobName = 'kktestdl/ehubactivitylogs/2019-01-23T15-53-09Z') {
    return "﻿<?xml version=\"1.0\" encoding=\"utf-8\"?><EnumerationResults ServiceEndpoint=\"https://kktestdl.blob.core.windows.net/\" ContainerName=\"alertlogic-dl\"><Prefix>kktestdl</Prefix><MaxResults>100</MaxResults><Blobs><Blob><Name>kktestdl/ehubactivitylogs/2019-01-23T15-53-06Z</Name><Properties><Creation-Time>Wed, 23 Jan 2019 15:53:09 GMT</Creation-Time><Last-Modified>Wed, 23 Jan 2019 15:53:09 GMT</Last-Modified><Etag>0x8D6814ADF284F6B</Etag><Content-Length>2224</Content-Length><Content-Type>application/octet-stream</Content-Type><Content-Encoding /><Content-Language /><Content-MD5>awDMbdCbE2Ug/pjWSIIaxg==</Content-MD5><Cache-Control /><Content-Disposition /><BlobType>BlockBlob</BlobType><LeaseStatus>unlocked</LeaseStatus><LeaseState>available</LeaseState><ServerEncrypted>true</ServerEncrypted></Properties></Blob><Blob><Name>" + blobName + "</Name><Properties><Creation-Time>Wed, 23 Jan 2019 15:53:09 GMT</Creation-Time><Last-Modified>Wed, 23 Jan 2019 15:53:09 GMT</Last-Modified><Etag>0x8D6814ADF282853</Etag><Content-Length>4121</Content-Length><Content-Type>application/octet-stream</Content-Type><Content-Encoding /><Content-Language /><Content-MD5>QtJ4ADhiTaTaXiBVqf9jcQ==</Content-MD5><Cache-Control /><Content-Disposition /><BlobType>BlockBlob</BlobType><LeaseStatus>unlocked</LeaseStatus><LeaseState>available</LeaseState><ServerEncrypted>true</ServerEncrypted></Properties></Blob><Blob><Name>kktestdl/ehubactivitylogs/2019-01-23T15-53-14Z</Name><Properties><Creation-Time>Wed, 23 Jan 2019 15:53:15 GMT</Creation-Time><Last-Modified>Wed, 23 Jan 2019 15:53:15 GMT</Last-Modified><Etag>0x8D6814AE2F971D2</Etag><Content-Length>2127</Content-Length><Content-Type>application/octet-stream</Content-Type><Content-Encoding /><Content-Language /><Content-MD5>5O/1TeQD6wJd+ZrL4e8Stw==</Content-MD5><Cache-Control /><Content-Disposition /><BlobType>BlockBlob</BlobType><LeaseStatus>unlocked</LeaseStatus><LeaseState>available</LeaseState><ServerEncrypted>true</ServerEncrypted></Properties></Blob><Blob><Name>kktestdl/ehubactivitylogs/2019-01-23T15-56-35Z</Name><Properties><Creation-Time>Wed, 23 Jan 2019 15:56:35 GMT</Creation-Time><Last-Modified>Wed, 23 Jan 2019 15:56:35 GMT</Last-Modified><Etag>0x8D6814B5A562BE6</Etag><Content-Length>4257</Content-Length><Content-Type>application/octet-stream</Content-Type><Content-Encoding /><Content-Language /><Content-MD5>3Y2UHwlL2FrCoPzm49uwJA==</Content-MD5><Cache-Control /><Content-Disposition /><BlobType>BlockBlob</BlobType><LeaseStatus>unlocked</LeaseStatus><LeaseState>available</LeaseState><ServerEncrypted>true</ServerEncrypted></Properties></Blob><Blob><Name>kktestdl/ehubgeneral/2019-01-23T15-44-58Z</Name><Properties><Creation-Time>Wed, 23 Jan 2019 15:44:58 GMT</Creation-Time><Last-Modified>Wed, 23 Jan 2019 15:44:58 GMT</Last-Modified><Etag>0x8D68149BA8F82AB</Etag><Content-Length>1193</Content-Length><Content-Type>application/octet-stream</Content-Type><Content-Encoding /><Content-Language /><Content-MD5>oUA31BVNzFFVTtqrTwBGCg==</Content-MD5><Cache-Control /><Content-Disposition /><BlobType>BlockBlob</BlobType><LeaseStatus>unlocked</LeaseStatus><LeaseState>available</LeaseState><ServerEncrypted>true</ServerEncrypted></Properties></Blob><Blob><Name>kktestdl/ehubgeneral/2019-01-23T15-45-04Z</Name><Properties><Creation-Time>Wed, 23 Jan 2019 15:45:04 GMT</Creation-Time><Last-Modified>Wed, 23 Jan 2019 15:45:04 GMT</Last-Modified><Etag>0x8D68149BE34839A</Etag><Content-Length>1193</Content-Length><Content-Type>application/octet-stream</Content-Type><Content-Encoding /><Content-Language /><Content-MD5>oUA31BVNzFFVTtqrTwBGCg==</Content-MD5><Cache-Control /><Content-Disposition /><BlobType>BlockBlob</BlobType><LeaseStatus>unlocked</LeaseStatus><LeaseState>available</LeaseState><ServerEncrypted>true</ServerEncrypted></Properties></Blob></Blobs><NextMarker /></EnumerationResults>";
};

const GET_BLOB_CONTENT_TEXT = {
        "records": [
            {
              "properties": {
                "serviceRequestId": "e0a5d4a5-e4b7-4ee7-b56c-59261e237a74",
                "statusCode": "OK"
              },
              "location": "global",
              "level": "Information",
              "identity": {
                "claims": {
                  "wids": "62e90394-69f5-4237-9190-012177145e10",
                  "ver": "1.0",
                  "uti": "123",
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn": "kkuzmin@alazurealertlogic.onmicrosoft.com",
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "kkuzmin@alazurealertlogic.onmicrosoft.com",
                  "http://schemas.microsoft.com/identity/claims/tenantid": "bf8d32d3-1c13-4487-af02-80dba2236485",
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "123",
                  "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
                  "puid": "10030000A19F1B13",
                  "http://schemas.microsoft.com/claims/authnmethodsreferences": "pwd",
                  "aio": "123",
                  "http://schemas.microsoft.com/claims/authnclassreference": "1",
                  "exp": "1548260145",
                  "nbf": "1548256245",
                  "iat": "1548256245",
                  "iss": "https://sts.windows.net/bf8d32d3-1c13-4487-af02-80dba2236485/",
                  "aud": "https://management.core.windows.net/",
                  "appid": "c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
                  "appidacr": "2",
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "Kuzmin",
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "Konstantin",
                  "groups": "a8d70315-c07f-412e-a5f7-50beea4b7981",
                  "ipaddr": "165.225.81.22",
                  "name": "Konstantin Kuzmin",
                  "http://schemas.microsoft.com/identity/claims/objectidentifier": "bea5cb4c-0348-49e4-b225-8acf2623d1ea"
                },
                "authorization": {
                  "evidence": {
                    "role": "Subscription Admin"
                  },
                  "action": "Microsoft.Web/sites/config/write",
                  "scope": "/subscriptions/05dcd414-c680-4f2c-8716-058cd058974b/resourceGroups/kktestdl/providers/Microsoft.Web/sites/kktestdl/config/appSettings"
                }
              },
              "correlationId": "4fa74760-07f2-4439-9c97-ded92ce726c2",
              "time": "2019-01-23T15:36:57.079Z",
              "resourceId": "/SUBSCRIPTIONS/05DCD414-C680-4F2C-8716-058CD058974B/RESOURCEGROUPS/KKTESTDL/PROVIDERS/MICROSOFT.WEB/SITES/KKTESTDL/CONFIG/APPSETTINGS",
              "operationName": "MICROSOFT.WEB/SITES/CONFIG/WRITE",
              "category": "Write",
              "resultType": "Success",
              "resultSignature": "Succeeded.OK",
              "durationMs": 2347,
              "callerIpAddress": "165.225.81.22"
            }
          ]
        };

    
module.exports = {
    context: context,
    timer: timer,
    ACTIVITY_LOG_RECORD: ACTIVITY_LOG_RECORD,
    AUDIT_LOG_RECORD: AUDIT_LOG_RECORD,
    O365_RECORD: O365_RECORD,
    SQL_AUDIT_LOG_RECORD: SQL_AUDIT_LOG_RECORD,
    getAuthResp: getAuthResp,
    AL_CID: AL_CID,
    AZURE_GET_EHUB_NS: AZURE_GET_EHUB_NS,
    AZURE_LIST_EVENT_HUBS: AZURE_LIST_EVENT_HUBS,
    AZURE_TOKEN_MOCK: AZURE_TOKEN_MOCK,
    AZURE_RESOURCE_NOT_FOUND: AZURE_RESOURCE_NOT_FOUND,
    LIST_CONTAINER_BLOBS: LIST_CONTAINER_BLOBS,
    GET_BLOB_CONTENT_TEXT: GET_BLOB_CONTENT_TEXT
};
