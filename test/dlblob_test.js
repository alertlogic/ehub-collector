/* -----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 * 
 * Unit tests for DLBlob functions
 * 
 * @end
 * -----------------------------------------------------------------------------
 */
 
const assert = require('assert');
const rewire = require('rewire');
const sinon = require('sinon');
const nock = require('nock');
const alcollector = require('al-collector-js');

const mock = require('./mock');
var AlAzureCollector = require('al-azure-collector-js').AlAzureCollector;
const dlblob = require('../DLBlob/index');
const ehubActivityLogsFormat = require('../EHubActivityLogs/format');
const ehubGeneralFormat = require('../EHubGeneral/format');

describe('Event hub health check unit tests.', function() {
    var fakeAuth;
    var processLogStub;
    
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
        process.env.APP_DL_CONTAINER_NAME = 'alertlogic-dl';
        
        // Expected Azure parameters
        process.env.APP_SUBSCRIPTION_ID = 'subscription-id';
        process.env.APP_RESOURCE_GROUP = 'kktest11-rg';
        process.env.APP_TENANT_ID = 'tenant-id';
        process.env.CUSTOMCONNSTR_APP_CLIENT_ID = 'client-id';
        process.env.CUSTOMCONNSTR_APP_CLIENT_SECRET = 'client-secret';
        
        processLogStub = sinon.stub(AlAzureCollector.prototype, 'processLog').callsFake(
                function fakeFn(messages, formatFun, hostmetaElems, callback) {
                    return callback(null);
                });
    });
    
    after(function() {
        nock.restore();
        fakeAuth.restore();
        processLogStub.restore();
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
        process.env.AzureWebJobsStorage = 'DefaultEndpointsProtocol=https;AccountName=kktestdl;AccountKey=S0meKey+';
        process.env.DL_BLOB_PAGE_SIZE = '10';
        process.env.WEBSITE_SITE_NAME = 'test-site';
        // Mock Azure HTTP calls
        // List blobs
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get('/alertlogic-dl')
        .query({'restype':'container','comp':'list','maxresults':process.env.DL_BLOB_PAGE_SIZE,'prefix':process.env.WEBSITE_SITE_NAME})
        .times(5)
        .reply(200, mock.LIST_CONTAINER_BLOBS());
        
        // Get blob content
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get(/alertlogic-dl.*/)
        .times(6)
        .reply(200, mock.GET_BLOB_CONTENT_TEXT);
        
        // Delete blob
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .delete(/alertlogic-dl.*/)
        .times(6)
        .reply(202);
        
        // Mock collector API
        var ehubGeneralFormatStub = sinon.stub(ehubGeneralFormat, 'logRecord')
        .callsFake(function fakeFn(message) {
            console.log(message);
            return ehubGeneralFormat(message);
        });
        
        var ehubActivityLogsFormatStub = sinon.stub(ehubActivityLogsFormat, 'logRecord')
        .callsFake(function fakeFn(message) {
            console.log(message);
            return ehubGeneralFormat(message);
        });
        
        var cb = function(err, res) {
            ehubGeneralFormatStub.restore();
            ehubActivityLogsFormatStub.restore();
            sinon.assert.callCount(processLogStub, 6);
            done();
        };
        dlblob(mock.context(cb), mock.timer);
    });
    
});

