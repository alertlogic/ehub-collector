/* -----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 * 
 * Unit tests for Master health-check  functions
 * 
 * @end
 * -----------------------------------------------------------------------------
 */
 
const assert = require('assert');
const sinon = require('sinon');
const nock = require('nock');
const alcollector = require('al-collector-js');

const mock = require('./mock');
const AlAzureMaster = require('al-azure-collector-js').AlAzureMaster;
const ehubHealthCheck = require('../Master/healthcheck');

describe('Event hub health check unit tests.', function() {
    var fakeAuth;
    
    before(function() {
        if (!nock.isActive()) {
            nock.activate();
        }
        // Mock Alert Logic HTTP calls
        fakeAuth = sinon.stub(alcollector.AimsC.prototype, 'authenticate').callsFake(
            function fakeFn() {
                return new Promise(function(resolve, reject) {
                    resolve(mock.getAuthResp());
                });
        });
        
        // Expected Alert Logic parameters
        process.env.WEBSITE_HOSTNAME = 'app-name';
        process.env.CUSTOMCONNSTR_APP_AL_ACCESS_KEY_ID = mock.AL_KEY_ID;
        process.env.CUSTOMCONNSTR_APP_AL_SECRET_KEY = mock.AL_SECRET;
        process.env.CUSTOMCONNSTR_APP_AL_API_ENDPOINT = mock.AL_API_ENDPOINT;
        process.env.CUSTOMCONNSTR_APP_AL_RESIDENCY = 'default';
        process.env.APP_INGEST_ENDPOINT = 'existing-ingest-endpoint';
        process.env.APP_AZCOLLECT_ENDPOINT = 'existing-azcollect-endpoint';
        process.env.COLLECTOR_HOST_ID = 'existing-host-id';
        process.env.COLLECTOR_SOURCE_ID = 'existing-source-id';
        
        // Expected Azure parameters
        process.env.WEBSITE_SITE_NAME = 'kktest11-name';
        process.env.APP_SUBSCRIPTION_ID = 'subscription-id';
        process.env.APP_RESOURCE_GROUP = 'kktest11-rg';
        process.env.APP_TENANT_ID = 'tenant-id';
        process.env.CUSTOMCONNSTR_APP_CLIENT_ID = 'client-id';
        process.env.CUSTOMCONNSTR_APP_CLIENT_SECRET = 'client-secret';
        process.env.AzureWebJobsStorage = 'DefaultEndpointsProtocol=https;AccountName=testappo365;AccountKey=S0meKey+';
    });
    
    after(function() {
        nock.restore();
    });

    beforeEach(function() {
        if (!nock.isActive()) {
            nock.activate();
        }
        //Mock Azure HTTP calls
        nock('https://login.microsoftonline.com:443', {'encodedQueryParams':true})
        .post(/token$/, /.*/)
        .query(true)
        .times(100)
        .reply(200, mock.AZURE_TOKEN_MOCK);
    });
    
    afterEach(function() {
        nock.cleanAll();
    });
    
    it('Simple OK health check', function(done) {
        // Mock Azure HTTP calls
        nock('https://management.azure.com:443', {'encodedQueryParams':true})
        .get(/2wljtgprz47om$/, /.*/ )
        .query(true)
        .times(1)
        .reply(200, mock.AZURE_GET_EHUB_NS());
        
        nock('https://management.azure.com:443', {'encodedQueryParams':true})
        .get(/eventhubs$/, /.*/ )
        .query(true)
        .times(1)
        .reply(200, mock.AZURE_LIST_EVENT_HUBS());
        
        process.env.APP_LOG_EHUB_CONNECTION = 'Endpoint=sb://alertlogicingest-centralus-2wljtgprz47om.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SomeKey+';
        
        var master = new AlAzureMaster(mock.DEFAULT_FUNCTION_CONTEXT, 'ehub', '1.0.0');
        
        ehubHealthCheck.eventHubNs(master, function(err) {
            assert.equal(err, null);
            done();
        });
    });
    
    it('Event hub namespace error', function(done) {
        // Mock Azure HTTP calls
        nock('https://management.azure.com:443', {'encodedQueryParams':true})
        .get(/2wljtgprz47om$/, /.*/ )
        .query(true)
        .times(1)
        .reply(200, mock.AZURE_GET_EHUB_NS('Created'));
        
        nock('https://management.azure.com:443', {'encodedQueryParams':true})
        .get(/eventhubs$/, /.*/ )
        .query(true)
        .times(1)
        .reply(200, mock.AZURE_LIST_EVENT_HUBS());
        
        process.env.APP_LOG_EHUB_CONNECTION = 'Endpoint=sb://alertlogicingest-centralus-2wljtgprz47om.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SomeKey+';
        
        var master = new AlAzureMaster(mock.DEFAULT_FUNCTION_CONTEXT, 'ehub', '1.0.0');
        
        ehubHealthCheck.eventHubNs(master, function(err) {
            const expected = {
                status: 'error',
                error_code: 'EHUB000001',
                details: ['Event Hub Namespaces state is not ok. Name = AlertLogicIngest-westeurope-pcmpl7iir6xxk, provisioningState = Created']
            };
            assert.deepEqual(err, expected);
            done();
        });
    });
        
    it('Event hub status error', function(done) {
        // Mock Azure HTTP calls
        nock('https://management.azure.com:443', {'encodedQueryParams':true})
        .get(/2wljtgprz47om$/, /.*/ )
        .query(true)
        .times(1)
        .reply(200, mock.AZURE_GET_EHUB_NS());
        
        nock('https://management.azure.com:443', {'encodedQueryParams':true})
        .get(/eventhubs$/, /.*/ )
        .query(true)
        .times(1)
        .reply(200, mock.AZURE_LIST_EVENT_HUBS('Disabled'));
        
        process.env.APP_LOG_EHUB_CONNECTION = 'Endpoint=sb://alertlogicingest-centralus-2wljtgprz47om.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SomeKey+';
        
        var master = new AlAzureMaster(mock.DEFAULT_FUNCTION_CONTEXT, 'ehub', '1.0.0');
        
        ehubHealthCheck.eventHubNs(master, function(err) {
            const expected = {
                status: 'error',
                error_code: 'EHUB000002',
                details: ['Event Hub status is not ok. Name = alertlogic-log, status = Disabled']
            };
            assert.deepEqual(err, expected);
            done();
        });
    });
    
});

