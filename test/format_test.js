const assert = require('assert');
const formatLog = require('../EHubGeneral/format').logRecord;
const mock = require('./mock');

describe('Format log units', function(){
    it('Formats log record correctly, no optional properties', function(done){
        let logRecord = Object.assign({}, mock.SQL_AUDIT_LOG_RECORD);
        delete logRecord.operationName;
        delete logRecord.category;
        logRecord.time = "2018-12-10T00:03:46Z";
        const formattedRecord = formatLog(logRecord);

        const expectedRecord = {
            messageTs: 1544400226,
            priority: 11,
            progName: 'EHubGeneral',
            message: JSON.stringify(logRecord),
            messageType: 'json/azure.ehub'
        };

        assert.deepEqual(formattedRecord, expectedRecord);
        done();
    });
    
    it('Formats log record correctly, with optional properties', function(done){
        let logRecord = Object.assign({}, mock.ACTIVITY_LOG_RECORD);
        logRecord.eventTimestamp = "2018-03-21T17:00:32.125Z";
        const formattedRecord = formatLog(logRecord);

        const expectedRecord = {
            messageTs: 1521651632,
            priority: 11,
            progName: 'EHubGeneral',
            message: JSON.stringify(logRecord),
            messageType: 'json/azure.ehub',
            messageTypeId: `${logRecord.category.value}`,
            messageTsUs: 125000
        };

        assert.deepEqual(formattedRecord, expectedRecord);
        done();
    });
    
    it('Formats log record correctly, with message type id of Zero', function(done){
        let logRecord = Object.assign({}, mock.AUDIT_LOG_RECORD);
        logRecord.time = "2018-03-21T17:00:32.125Z";
        logRecord.category = 0;
        const formattedRecord = formatLog(logRecord);

        const expectedRecord = {
            messageTs: 1521651632,
            priority: 11,
            progName: 'EHubGeneral',
            message: JSON.stringify(logRecord),
            messageType: 'json/azure.ehub',
            messageTypeId: '0',
            messageTsUs: 125000
        };

        assert.deepEqual(formattedRecord, expectedRecord);
        done();
    });
});
