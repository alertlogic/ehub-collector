/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 * 
 * Unit tests for EHubActivityLogs functions
 * 
 * @end
 * -----------------------------------------------------------------------------
 */
 
const assert = require('assert');
const sinon = require('sinon');
const mock = require('./mock');

var AlAzureCollector = require('al-azure-collector-js').AlAzureCollector;
var ehubActivityLogs = require('../EHubActivityLogs/index');
var formatFun = require('../EHubActivityLogs/format').logRecord;

describe('Event hub activity logs function unit tests.', function() {
    
    it('Simple OK test, activity record', function(done) {
        var result = formatFun(mock.ACTIVITY_LOG_RECORD);
        assert.equal(result.message, JSON.stringify(mock.ACTIVITY_LOG_RECORD));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, 'Recommendation');
        assert.equal(result.messageTs, 1545207501);
        assert.equal(result.messageTsUs, 183454);
        
        done();
    });
    
    it('OK test, no usec', function(done) {
        var testRecord = Object.assign({}, mock.ACTIVITY_LOG_RECORD);
        testRecord.eventTimestamp = '2018-12-19T08:18:21.13Z';
        var result = formatFun(testRecord);
        assert.equal(result.message, JSON.stringify(testRecord));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, 'Recommendation');
        assert.equal(result.messageTs, 1545207501);
        assert.equal(result.messageTsUs, 130000);
        
        done();
    });
    
    it('Simple OK test, audit record', function(done) {
        var result = formatFun(mock.AUDIT_LOG_RECORD);
        assert.equal(result.message, JSON.stringify(mock.AUDIT_LOG_RECORD));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, 'AuditLogs');
        assert.equal(result.messageTs, 1544400226);
        assert.equal(result.messageTsUs, 616182);
        
        done();
    });
    
    it('Default message type id (null)', function(done) {
        var testRecord = Object.assign({}, mock.AUDIT_LOG_RECORD);
        delete testRecord.category;
        delete testRecord.operationName;
        var result = formatFun(testRecord);
        assert.equal(result.message, JSON.stringify(testRecord));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, null);
        assert.equal(result.messageTs, 1544400226);
        assert.equal(result.messageTsUs, 616182);
        
        done();
    });
    
});

