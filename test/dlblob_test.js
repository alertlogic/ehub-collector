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

const mock = require('./mock');
var AlAzureCollector = require('@alertlogic/al-azure-collector-js').AlAzureCollector;
const dlblob = require('../DLBlob/index');
const ehubGeneralFormat = require('../EHubGeneral/format');

const blobContentText = JSON.stringify(mock.GET_BLOB_CONTENT_TEXT);
const blobContentHeaders = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(blobContentText),
    'ETag': '"0x8D1234567890"',
    'Last-Modified': 'Wed, 23 Jan 2019 15:53:09 GMT'
};
const xmlContentHeaders = { 'Content-Type': 'application/xml' };
const xmlErrorHeaders = { 'Content-Type': 'application/xml', 'x-ms-error-code': 'ContainerNotFound' };
const isBlobListQuery = (queryObj) => (
    queryObj.restype === 'container' &&
    queryObj.comp === 'list' &&
    queryObj.prefix === process.env.WEBSITE_SITE_NAME
);


describe('Event hub DLBlob function unit tests.', function() {
    var processLogStub;
    
    before(function() {
        if (!nock.isActive()) {
            nock.activate();
        }
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
        process.env.AzureWebJobsStorage = 'DefaultEndpointsProtocol=https;AccountName=kktestdl;AccountKey=S0meKey+;EndpointSuffix=core.windows.net';
        
        processLogStub = sinon.stub(AlAzureCollector.prototype, 'processLog').callsFake(
                async function fakeFn(message, formatFun, hostmetaElems) {
                    formatFun(message);
                    return null;
                });
    });
    
    after(function() {
        nock.restore();
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
    
    it('Simple OK check', async function() {
        process.env.DL_BLOB_PAGE_SIZE = '10';
        // Mock Azure HTTP calls
        // List blobs
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get('/alertlogic-dl')
        .query(isBlobListQuery)
        .times(5)
        .reply(200, mock.LIST_CONTAINER_BLOBS(), xmlContentHeaders);
        
        // Get blob content
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get(/alertlogic-dl.*/)
        .times(6)
        .reply(200, blobContentText, blobContentHeaders);
        
        // Delete blob
        var deleteBlobStub = sinon.fake();
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .delete(/alertlogic-dl.*/)
        .times(6)
        .reply(202, function() {deleteBlobStub();});
        
        await dlblob(mock.context(), mock.timer);
        sinon.assert.callCount(processLogStub, 6);
        sinon.assert.callCount(deleteBlobStub, 6);
        sinon.assert.calledWith(processLogStub, sinon.match.any, ehubGeneralFormat.logRecord);
    });
    
    it('Blob list error', async function() {
        // Mock Azure HTTP calls
        // List blobs
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get('/alertlogic-dl')
        .query(isBlobListQuery)
        .reply(404, mock.CONTAINER_NOT_FOUND, xmlErrorHeaders);
        
        try {
            await dlblob(mock.context(), mock.timer);
        } catch (err) {
            sinon.assert.callCount(processLogStub, 0);
            assert.equal(err.statusCode, 404);
            assert.equal(err.code, 'ContainerNotFound');
        }
    });
    
    it('Get blob content error', async function() {
        // Mock Azure HTTP calls
        // List blobs
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get('/alertlogic-dl')
        .query(isBlobListQuery)
        .reply(200, mock.LIST_CONTAINER_BLOBS(), xmlContentHeaders);
        
        // Get blob content 2019-01-23T15-53-06Z
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get(/alertlogic-dl\/kktestdl\/ehubgeneral\/2019-01-23T15-53-06Z/)
        .times(1)
        .reply(200, blobContentText, blobContentHeaders);
        
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get(/alertlogic-dl\/kktestdl\/ehubgeneral.*/)
        .times(5)
        .reply(404, mock.CONTAINER_NOT_FOUND, xmlErrorHeaders);
        
        // Delete blob
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .delete(/alertlogic-dl.*/)
        .times(1)
        .reply(202);
        
        try {
            await dlblob(mock.context(), mock.timer);
        } catch (err) {
            err.every(function(res) {
                const errorCode = res.error.code || (res.error.details && res.error.details.errorCode);
                assert.equal(errorCode, 'ContainerNotFound');
                assert.equal(res.error.statusCode, 404);
            });
            assert.equal(err.length, 5);
            sinon.assert.callCount(processLogStub, 1);
        }
    });
    
    it('Delete blob error', async function() {
        // Mock Azure HTTP calls
        // List blobs
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get('/alertlogic-dl')
        .query(isBlobListQuery)
        .reply(200, mock.LIST_CONTAINER_BLOBS(), xmlContentHeaders);
        
        // Get blob content
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .get(/alertlogic-dl.*/)
        .times(6)
        .reply(200, blobContentText, blobContentHeaders);
        
        // Delete blob
        nock('https://kktestdl.blob.core.windows.net:443', {'encodedQueryParams':true})
        .delete(/alertlogic-dl\/kktestdl\/ehubgeneral.*/)
        .times(6)
        .reply(404, mock.CONTAINER_NOT_FOUND, xmlErrorHeaders);
        
        try {
            await dlblob(mock.context(), mock.timer);
        } catch (err) {
            err.every(function(res) {
                const errorCode = res.error.code || (res.error.details && res.error.details.errorCode);
                assert.equal(errorCode, 'ContainerNotFound');
                assert.equal(res.error.statusCode, 404);
            });
            assert.equal(err.length, 6);
            sinon.assert.callCount(processLogStub, 6);
        }
    });
});