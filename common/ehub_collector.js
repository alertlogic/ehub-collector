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
    if (context.bindings.dlBlob && context.bindings.dlBlob instanceof Array) {
        context.bindings.dlBlob.append([messages]);
    } else {
        context.bindings.dlBlob = [messages];
    }
    return skipped;
};

module.exports = function (context, eventHubMessages, parseFun, processErrorFun, callback) {
    var processError = processErrorFun ? processErrorFun : defaultProcessError;
    var collector = new AlAzureCollector(context, 'ehub', pkg.version);
    async.reduce(eventHubMessages, {processed: 0, skipped: 0},
        function(acc, msgArray, callback) {
            try {
                collector.processLog(msgArray.records, parseFun, null,
                    function(err) {
                        if (err) {
                            acc.skipped += processError(context, err, msgArray);
                        } else {
                            acc.processed += msgArray.records.length;
                        }
                        return callback(null, acc);
                });
            } catch (exception) {
                acc.skipped += processError(context, exception, msgArray);
                return callback(null, acc);
            }
        },
        function(err, redResult) {
            if (err) {
                const skipped = processError(context, err, eventHubMessages);
                context.log.error('Records skipped:', skipped);
                return callback(err);
            } else {
                context.log.info('Processed:', redResult.processed);
                if (redResult.skipped) {
                    context.log.info('Records skipped:', redResult.skipped);
                }
                return callback(null, redResult);
            }
    });
};
