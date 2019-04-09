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
const sinon = require('sinon');
const nock = require('nock');
const alcollector = require('@alertlogic/al-collector-js');

const mock = require('./mock');
var AlAzureCollector = require('@alertlogic/al-azure-collector-js').AlAzureCollector;
const dlblob = require('../DLBlob/index');
const ehubGeneralFormat = require('../EHubGeneral/format');


describe('Event hub DLBlob function unit tests.', function() {
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
        process.env.DL_BLOB_PAGE_SIZE = '100';
        
        // Expected Azure parameters
        process.env.APP_SUBSCRIPTION_ID = 'subscription-id';
        process.env.APP_RESOURCE_GROUP = 'kktest11-rg';
        process.env.APP_TENANT_ID = 'tenant-id';
        process.env.CUSTOMCONNSTR_APP_CLIENT_ID = 'client-id';
        process.env.CUSTOMCONNSTR_APP_CLIENT_SECRET = 'client-secret';
        process.env.AzureWebJobsStorage = 'DefaultEndpointsProtocol=https;AccountName=kktestdl;AccountKey=S0meKey+';
        
        processLogStub = sinon.stub(AlAzureCollector.prototype, 'processLog').callsFake(
                function fakeFn(message, formatFun, hostmetaElems, callback) {
                    formatFun(message);
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
        processLogStub.resetHistory();
        
        
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
        .reply(200, '', mock.statsQueueMetadataHeaders());
        
        nock('https://kktestdl.queue.core.windows.net:443', {"encodedQueryParams":true})
        .get('/alertlogic-stats/messages')
        .query(true)
        .times(100)
        .reply(200, mock.statsMessage);

        nock('https://kktestdl.queue.core.windows.net:443', {"encodedQueryParams":true})
        .delete(/alertlogic-stats\/messages.*/)
        .query(true)
        .times(100)
        .reply(204,'');

    });
    
    afterEach(function() {
        nock.cleanAll();
    });
    
    it('Simple OK check', function(done) {
        process.env.DL_BLOB_PAGE_SIZE = '10';
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
        var deleteBlobStub = sinon.fake();
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .delete(/alertlogic-dl.*/)
        .times(6)
        .reply(202, function() {deleteBlobStub();});
        
        var cb = function(err, res) {
            sinon.assert.callCount(processLogStub, 6);
            sinon.assert.callCount(deleteBlobStub, 6);
            sinon.assert.calledWith(processLogStub, sinon.match.any, ehubGeneralFormat.logRecord);
            done();
        };
        dlblob(mock.context(cb), mock.timer);
    });
    
    it('Blob list error', function(done) {
        // Mock Azure HTTP calls
        // List blobs
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get('/alertlogic-dl')
        .query({'restype':'container','comp':'list','maxresults':process.env.DL_BLOB_PAGE_SIZE,'prefix':process.env.WEBSITE_SITE_NAME})
        .reply(404, mock.CONTAINER_NOT_FOUND);
        
        var cb = function(err, res) {
            sinon.assert.callCount(processLogStub, 0);
            assert.equal(err.statusCode, 404);
            assert.equal(err.code, 'ContainerNotFound');
            assert.equal(res, null);
            done();
        };
        dlblob(mock.context(cb), mock.timer);
    });
    
    it('Get blob content error', function(done) {
        // Mock Azure HTTP calls
        // List blobs
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get('/alertlogic-dl')
        .query({'restype':'container','comp':'list','maxresults':process.env.DL_BLOB_PAGE_SIZE,'prefix':process.env.WEBSITE_SITE_NAME})
        .reply(200, mock.LIST_CONTAINER_BLOBS());
        
        // Get blob content 2019-01-23T15-53-06Z
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get(/alertlogic-dl\/kktestdl\/ehubgeneral\/2019-01-23T15-53-06Z/)
        .times(1)
        .reply(200, mock.GET_BLOB_CONTENT_TEXT);
        
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get(/alertlogic-dl\/kktestdl\/ehubgeneral.*/)
        .times(5)
        .reply(404, mock.CONTAINER_NOT_FOUND);
        
        // Delete blob
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .delete(/alertlogic-dl.*/)
        .times(1)
        .reply(202);
        
        var cb = function(err) {
            err.every(function(res) {
                assert.equal(res.error.code, 'ContainerNotFound');
                assert.equal(res.error.statusCode, 404);
            });
            assert.equal(err.length, 5);
            sinon.assert.callCount(processLogStub, 1);
            done();
        };
        dlblob(mock.context(cb), mock.timer);
    });
    
    it('Delete blob error', function(done) {
        // Mock Azure HTTP calls
        // List blobs
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get('/alertlogic-dl')
        .query({'restype':'container','comp':'list','maxresults':process.env.DL_BLOB_PAGE_SIZE,'prefix':process.env.WEBSITE_SITE_NAME})
        .reply(200, mock.LIST_CONTAINER_BLOBS());
        
        // Get blob content
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get(/alertlogic-dl.*/)
        .times(6)
        .reply(200, mock.GET_BLOB_CONTENT_TEXT);
        
        // Delete blob
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .delete(/alertlogic-dl\/kktestdl\/ehubgeneral.*/)
        .times(6)
        .reply(404, mock.CONTAINER_NOT_FOUND);
        
        var cb = function(err) {
            err.every(function(res) {
                assert.equal(res.error.code, 'ContainerNotFound');
                assert.equal(res.error.statusCode, 404);
            });
            assert.equal(err.length, 6);
            sinon.assert.callCount(processLogStub, 6);
            done();
        };
        dlblob(mock.context(cb), mock.timer);
    });
});

