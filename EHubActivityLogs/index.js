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

const pkg = require('../package.json');
const AlAzureCollector = require('al-azure-collector-js').AlAzureCollector;

module.exports = function (context, eventHubMessages) {
    if (eventHubMessages.length > 1) {
        context.log('WARNING: dropping messages');
    }
    var collector = new AlAzureCollector(context, 'ehub', pkg.version);
    var formatFun = function(msg) {
        var ts = msg.eventTimestamp ? Date.parse(msg.eventTimestamp) : Date.now();
        return {
            messageTs: ts,
            priority: 11,
            progName: 'EHubActivityLogs',
            pid: undefined,
            message: JSON.stringify(msg),
            messageType: 'json/azure.o365',
            messageTypeId: msg.operationName.name,
            // TODO: parse microseconds.
            messageTsUs: undefined
        };
    };
    collector.processLog(eventHubMessages[0].records, formatFun, [], function(err) {
        if (err) {
            // TODO: DLQ
            context.log.error('Error processing messages:', err);
        }
        context.log.error('Processed:', eventHubMessages.records.length);
        context.done();
    });
};

