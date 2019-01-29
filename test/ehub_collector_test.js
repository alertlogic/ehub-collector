/* -----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 * 
 * Unit tests for common ehub collector functions
 * 
 * @end
 * -----------------------------------------------------------------------------
 */
 
const assert = require('assert');
const sinon = require('sinon');
const nock = require('nock');
const alcollector = require('al-collector-js');

const mock = require('./mock');
const ehubCollector = require('../common/ehub_collector');
const ehubActivityLogsFormat = require('../EHubActivityLogs/format');


describe('Common Event hub collector unit tests.', function() {
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
        process.env.WEBSITE_SITE_NAME = 'test-site';
        process.env.CUSTOMCONNSTR_APP_AL_ACCESS_KEY_ID = mock.AL_KEY_ID;
        process.env.CUSTOMCONNSTR_APP_AL_SECRET_KEY = mock.AL_SECRET;
        process.env.CUSTOMCONNSTR_APP_AL_API_ENDPOINT = mock.AL_API_ENDPOINT;
        process.env.CUSTOMCONNSTR_APP_AL_RESIDENCY = 'default';
        process.env.APP_INGEST_ENDPOINT = 'existing-ingest-endpoint';
        process.env.APP_AZCOLLECT_ENDPOINT = 'existing-azcollect-endpoint';
        process.env.COLLECTOR_HOST_ID = 'existing-host-id';
        process.env.COLLECTOR_SOURCE_ID = 'existing-source-id';
        process.env.APP_DL_CONTAINER_NAME = 'alertlogic-dl';
        
        // Expected Azure parameters
        process.env.APP_SUBSCRIPTION_ID = 'subscription-id';
        process.env.APP_RESOURCE_GROUP = 'kktest11-rg';
        process.env.APP_TENANT_ID = 'tenant-id';
        process.env.CUSTOMCONNSTR_APP_CLIENT_ID = 'client-id';
        process.env.CUSTOMCONNSTR_APP_CLIENT_SECRET = 'client-secret';
        
    });
    
    after(function() {
        nock.restore();
        fakeAuth.restore();
    });

    beforeEach(function() {
        if (!nock.isActive()) {
            nock.activate();
        }
    });
    
    afterEach(function() {
        nock.cleanAll();
    });
    
    it('Simple OK check', function(done) {
        const testMessage = [{ records: [mock.SQL_AUDIT_LOG_RECORD]}];
        var ingestSendStub = sinon.stub(alcollector.IngestC.prototype, 'sendAicspmsgs').resolves({});
        
        ehubCollector(mock.context(), testMessage, ehubActivityLogsFormat.logRecord , null, function(err, res) {
            ingestSendStub.restore();
            sinon.assert.callCount(ingestSendStub, 1);
            done();
        });
    });
    
});

