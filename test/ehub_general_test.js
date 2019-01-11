/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 * 
 * Unit tests for EHubGeneral function
 * 
 * @end
 * -----------------------------------------------------------------------------
 */
 
const assert = require('assert');
const rewire = require('rewire');
const sinon = require('sinon');
const mock = require('./mock');

var AlAzureCollector = require('al-azure-collector-js').AlAzureCollector;
var ehubGeneral = require('../EHubGeneral/index');
var ehubGeneralWire = rewire('../EHubGeneral/index');

describe('Event hub functions unit tests.', function() {
    
    it('Simple OK test, activity record', function(done) {
        var privFormatFun = ehubGeneralWire.__get__('formatGeneralLogRecord');
        var result = privFormatFun(mock.ACTIVITY_LOG_RECORD);
        assert.equal(result.message, JSON.stringify(mock.ACTIVITY_LOG_RECORD));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, 'Recommendation');
        assert.equal(result.messageTs, 1545207501);
        assert.equal(result.messageTsUs, 183454);
        
        done();
    });
    
    it('Simple OK test, o365 record', function(done) {
        var privFormatFun = ehubGeneralWire.__get__('formatGeneralLogRecord');
        var result = privFormatFun(mock.O365_RECORD);
        assert.equal(result.message, JSON.stringify(mock.O365_RECORD));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, '15');
        assert.equal(result.messageTs, 1521651632);
        assert.equal(result.messageTsUs, null);
        
        done();
    });
    
    it('Simple OK test, other record', function(done) {
        var privFormatFun = ehubGeneralWire.__get__('formatGeneralLogRecord');
        var testRecord = {
             "CreationTime": "2018-03-21T17:00:32",
             some: 'value'
        };
        var result = privFormatFun(testRecord);
        assert.equal(result.message, JSON.stringify(testRecord));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, null);
        assert.equal(result.messageTs, 1521651632);
        assert.equal(result.messageTsUs, null);
        
        done();
    });

    it('Batch processing error test', function(done) {
        process.env.WEBSITE_HOSTNAME = 'app-name';
        process.env.COLLECTOR_HOST_ID = 'host-id';
        process.env.COLLECTOR_SOURCE_ID = 'source-id';
        process.env.CUSTOMCONNSTR_APP_AL_ACCESS_KEY_ID = mock.AL_KEY_ID;
        process.env.CUSTOMCONNSTR_APP_AL_SECRET_KEY = mock.AL_SECRET;
        process.env.CUSTOMCONNSTR_APP_AL_API_ENDPOINT = mock.AL_API_ENDPOINT;
        process.env.CUSTOMCONNSTR_APP_AL_RESIDENCY = 'default';
        process.env.APP_INGEST_ENDPOINT = mock.INGEST_API_ENDPOINT;
        process.env.APP_AZCOLLECT_ENDPOINT = mock.AZCOLLECT_API_ENDPOINT;
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
        testDone = function() {
            processLogStub.restore();
            sinon.assert.callCount(processLogStub, 3);
            done();
        };
        var inputContext = mock.context(testDone);
        ehubGeneral(inputContext, inputRecords);
    });
});

