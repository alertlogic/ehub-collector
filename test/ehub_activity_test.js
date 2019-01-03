/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 * 
 * Unit tests for EHub functions
 * 
 * @end
 * -----------------------------------------------------------------------------
 */
 
var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var mock = require('./mock');

var ehubActivityLogs = rewire('../EHubActivityLogs/index');

describe('Event hub functions unit tests.', function() {
    
    it('Simple OK test, activity record', function(done) {
        var privFormatFun = ehubActivityLogs.__get__('formatActivityLogRecord');
        var result = privFormatFun(mock.ACTIVITY_LOG_RECORD);
        assert.equal(result.message, JSON.stringify(mock.ACTIVITY_LOG_RECORD));
        assert.equal(result.messageTypeId, 'Microsoft.Advisor/recommendations/available/action');
        assert.equal(result.messageTs, 1545207501183);
        assert.equal(result.messageTsUs, 4546);
        
        done();
    });
    
    it('OK test, no usec', function(done) {
        var privFormatFun = ehubActivityLogs.__get__('formatActivityLogRecord');
        var testRecord = mock.ACTIVITY_LOG_RECORD;
        testRecord.eventTimestamp = '2018-12-19T08:18:21.13Z';
        var result = privFormatFun(testRecord);
        assert.equal(result.message, JSON.stringify(testRecord));
        assert.equal(result.messageTypeId, 'Microsoft.Advisor/recommendations/available/action');
        assert.equal(result.messageTs, 1545207501130);
        assert.equal(result.messageTsUs, null);
        
        done();
    });
    
    it('Simple OK test, audit record', function(done) {
        var privFormatFun = ehubActivityLogs.__get__('formatActivityLogRecord');
        var result = privFormatFun(mock.AUDIT_LOG_RECORD);
        assert.equal(result.message, JSON.stringify(mock.AUDIT_LOG_RECORD));
        assert.equal(result.messageTypeId, 'Update policy');
        assert.equal(result.messageTs, 1544400226616);
        assert.equal(result.messageTsUs, 1822);
        
        done();
    });
    
    it('Default message type (Administrative)', function(done) {
        var privFormatFun = ehubActivityLogs.__get__('formatActivityLogRecord');
        var testRecord = mock.AUDIT_LOG_RECORD;
        delete testRecord.category;
        delete testRecord.operationName;
        var result = privFormatFun(testRecord);
        assert.equal(result.message, JSON.stringify(mock.AUDIT_LOG_RECORD));
        assert.equal(result.messageTypeId, 'Administrative');
        assert.equal(result.messageTs, 1544400226616);
        assert.equal(result.messageTsUs, 1822);
        
        done();
    });
});

