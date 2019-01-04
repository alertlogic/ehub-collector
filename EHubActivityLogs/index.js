/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 *
 * The function captures Azure activity logs exported via Azure Monitor service into Event hub
 * 
 * A Log Profile currently only allows you to select an Event Hubs namespace, 
 * in which an event hub is created with the name 'insights-operational-logs.' 
 * It is not yet possible to specify your own event hub name in a Log Profile.
 * 
 * https://docs.microsoft.com/en-us/azure/azure-monitor/platform/stream-monitoring-data-event-hubs
 *
 * @end
 * -----------------------------------------------------------------------------
 */

const async = require('async');
const pkg = require('../package.json');
const AlAzureCollector = require('al-azure-collector-js').AlAzureCollector;
const parse = require('../common/parse');

var formatActivityLogRecord = function(msg) {
    const ts = parse.getMsgTs(msg);
    // If properties.eventCategory is not present, category is "Administrative"
    // https://docs.microsoft.com/en-us/azure/azure-monitor/platform/activity-log-schema#mapping-to-diagnostic-logs-schema
    const type = parse.getMsgType(msg, 'Administrative');
    return {
        messageTs: ts.msec,
        priority: 11,
        progName: 'EHubActivityLogs',
        pid: undefined,
        message: JSON.stringify(msg),
        messageType: 'json/azure.activitylog',
        messageTypeId: type,
        messageTsUs: ts.usec
    };
};

module.exports = function (context, eventHubMessages) {
    var collector = new AlAzureCollector(context, 'ehub', pkg.version);
    async.map(eventHubMessages, 
        function(msgArray, callback) {
            collector.processLog(msgArray.records, formatActivityLogRecord, [],
                function(err) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, msgArray.records.length);
                    }
            });
        },
        function(err, mapResult) {
            if (err) {
                // TODO: DLQ
                context.log.error('Error processing messages:', err);
            } else {
                context.log.error('Processed:', mapResult.reduce((a, b) => a + b, 0));
            }
            context.done();
    });
};

