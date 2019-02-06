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
const mock = require('./mock');

var formatFun = require('../EHubGeneral/format').logRecord;

describe('Event hub general function unit tests.', function() {
    
    it('Simple OK test, activity record', function(done) {
        var result = formatFun(mock.ACTIVITY_LOG_RECORD);
        assert.equal(result.message, JSON.stringify(mock.ACTIVITY_LOG_RECORD));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, 'Recommendation');
        assert.equal(result.messageTs, 1545207501);
        assert.equal(result.messageTsUs, 183454);
        
        done();
    });
    
    it('Simple OK test, SQL audit log record', function(done) {
        var result = formatFun(mock.SQL_AUDIT_LOG_RECORD);
        assert.equal(result.message, JSON.stringify(mock.SQL_AUDIT_LOG_RECORD));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, 'SQLSecurityAuditEvents');
        assert.equal(result.messageTs, 1548192086);
        assert.equal(result.messageTsUs, 844000);
        
        done();
    });
    
    it('Simple OK test, o365 record', function(done) {
        var result = formatFun(mock.O365_RECORD);
        assert.equal(result.message, JSON.stringify(mock.O365_RECORD));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, '15');
        assert.equal(result.messageTs, 1521651632);
        assert.equal(result.messageTsUs, null);
        
        done();
    });
    
    it('Simple OK test, other record', function(done) {
        var testRecord = {
             "CreationTime": "2018-03-21T17:00:32",
             some: 'value'
        };
        var result = formatFun(testRecord);
        assert.equal(result.message, JSON.stringify(testRecord));
        assert.equal(result.messageType, 'json/azure.ehub');
        assert.equal(result.messageTypeId, null);
        assert.equal(result.messageTs, 1521651632);
        assert.equal(result.messageTsUs, null);
        
        done();
    });

});

