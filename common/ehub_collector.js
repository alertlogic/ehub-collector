/* -----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 *
 * Common Azure Event Hub collector function implementation
 *
 * @end
 * -----------------------------------------------------------------------------
 */

const async = require('async');
const pkg = require('../package.json');
const AlAzureCollector = require('al-azure-collector-js').AlAzureCollector;

var defaultProcessError = function(context, err, messages) {
    context.log.error('Error processing batch:', err);
    var skipped = messages.records ? messages.records.length : messages.length;
    context.log.error('Records skipped:', skipped);
    context.bindings.dlBlob = JSON.stringify(messages);
    return context;
};

module.exports = function (context, eventHubMessages, parseFun, processErrorFun, callback) {
    var processError = processErrorFun ? processErrorFun : defaultProcessError;
    var collector = new AlAzureCollector(context, 'ehub', pkg.version);
    async.filter(eventHubMessages, 
        function(msgArray, callback) {
            try {
                collector.processLog(msgArray.records, parseFun, null,
                    function(err) {
                        if (err) {
                            processError(context, err, msgArray);
                        }
                        return callback(null, !err);
                });
            } catch (exception) {
                processError(context, exception, msgArray);
                return callback(null, false);
            }
        },
        function(err, mapResult) {
            if (err) {
                processError(context, err, eventHubMessages);
                return callback(err);
            } else {
                const processedCount = mapResult.reduce(function(acc, b) {
                    return acc + b.records ? b.records.length : 0;
                }, 0);
                context.log.info('Processed:', processedCount);
            }
            return callback(null);
    });
};
