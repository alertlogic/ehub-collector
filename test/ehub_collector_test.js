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
const alcollector = require('@alertlogic/al-collector-js');

const mock = require('./mock');
const AlAzureCollector = require('@alertlogic/al-azure-collector-js').AlAzureCollector;
const ehubCollector = require('../common/ehub_collector');
const ehubGeneralFormat = require('../EHubGeneral/format');

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
        process.env.AzureWebJobsStorage = 'DefaultEndpointsProtocol=https;AccountName=kktestdl;AccountKey=S0meKey+';
        
    });
    
    after(function() {
        nock.restore();
        fakeAuth.restore();
    });

    beforeEach(function() {
        if (!nock.isActive()) {
            nock.activate();
        }
        // Collection stats Azure mocks
        nock('https://kktestdl.queue.core.windows.net:443', {'encodedQueryParams':true})
        .head('/alertlogic-stats')
        .query({'comp':'metadata'})
        .times(100)
        .reply(200, '', mock.statsQueueMetadataHeaders());
        
        nock('https://kktestdl.queue.core.windows.net:443', {'encodedQueryParams':true})
        .get('/alertlogic-stats')
        .query({'comp':'metadata'})
        .times(100)
        .reply(200, '');
        
        nock('https://kktestdl.queue.core.windows.net:443', {'encodedQueryParams':true})
        .post('/alertlogic-stats/messages' )
        .query(true)
        .times(100)
        .reply(201, '');
    });
    
    afterEach(function() {
        nock.cleanAll();
    });
    
    it('Simple OK check', function(done) {
        const testMessage = [{ records: [mock.SQL_AUDIT_LOG_RECORD]}];
        var ingestSendStub = sinon.stub(alcollector.IngestC.prototype, 'sendAicspmsgs').resolves({});
        ehubCollector(mock.context(), testMessage, ehubGeneralFormat.logRecord , null, function(err, res) {
            assert.equal(err, null);
            ingestSendStub.restore();
            sinon.assert.callCount(ingestSendStub, 1);
            done();
        });
    });
    
    it('Batch processing error test', function(done) {
        process.env.COLLECTOR_HOST_ID = 'host-id';
        process.env.COLLECTOR_SOURCE_ID = 'source-id';
        var processLogStub = sinon.stub(AlAzureCollector.prototype, 'processLog').callsFake(
                function fakeFn(messages, formatFun, hostmetaElems, callback) {
                    if (messages[0].operationName === 'Good batch') {
                        return callback(null);
                    } else {
                        return callback('Test processing error');
                    }
                });
        const inputRecords = [
            {records: [{operationName: 'Good batch'}, {some: 'message 1'}]},
            {records: [{operationName: 'Bad batch'}, {bad: 'mAssage'}]},
            {records: [{operationName: 'Good batch'}, {some: 'message 2'}]},
        ];
        
        ehubCollector(mock.context(), inputRecords, ehubGeneralFormat.logRecord , null, function(err, res) {
            processLogStub.restore();
            sinon.assert.callCount(processLogStub, 3);
            done();
        });
    });
    
});

