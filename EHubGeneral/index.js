/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 *
 * The function captures logs from a general purpose Event hub.
 *
 * @end
 * -----------------------------------------------------------------------------
 */


const async = require('async');
const pkg = require('../package.json');
const AlAzureCollector = require('al-azure-collector-js').AlAzureCollector;
const parse = require('../common/parse');

var formatGeneralLogRecord = function(msg) {
    const ts = parse.getMsgTs(msg);
    const typeId = parse.getMsgTypeId(msg, null);
    return {
        messageTs: ts.sec,
        priority: 11,
        progName: 'EHubGeneral',
        pid: undefined,
        message: JSON.stringify(msg),
        messageType: 'json/azure.ehub',
        messageTypeId: typeId,
        messageTsUs: ts.usec
    };
};

module.exports = function (context, eventHubMessages) {
    var collector = new AlAzureCollector(context, 'ehub', pkg.version);
    async.filter(eventHubMessages, 
        function(msgArray, callback) {
            collector.processLog(msgArray.records, formatGeneralLogRecord, [],
                function(err) {
                    if (err) {
                     // TODO: DLQ
                        context.log.error('Error processing batch:', err);
                        context.log.error('Records skipped:', msgArray.records.length);
                    }
                    return callback(null, !err);
            });
        },
        function(err, mapResult) {
            if (err) {
                // TODO: DLQ
                context.log.error('Processing error:', err);
            } else {
                context.log.info('Processed:', mapResult.reduce((a, b) => a + b.records.length, 0));
            }
            context.done();
    });
};


