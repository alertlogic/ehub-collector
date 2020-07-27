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
const AlAzureCollector = require('@alertlogic/al-azure-collector-js').AlAzureCollector;

const defaultProcessError = function(context, err, messages) {
    context.log.error('Error processing batch:', err);
    const skipped = messages.length;
    // We're going to ignore 400s from ingest right now. Do not put them in the DLQ
    if(err.statusCode >= 400 && err.statusCode < 500){
        return skipped;
    }
    // Otherwise, we need to put them in the DLQ
    else if (context.bindings.dlBlob && context.bindings.dlBlob instanceof Array) {
        context.bindings.dlBlob.push(messages);
    } else {
        context.bindings.dlBlob = [messages];
    }
    return skipped;
};

module.exports = function (context, eventHubMessages, parseFun, processErrorFun, callback) {
    var processError = processErrorFun ? processErrorFun : defaultProcessError;
    var collector = new AlAzureCollector(context, 'ehub', pkg.version);
    async.reduce(eventHubMessages, [],
        function(acc, message, reduceCallback) {
            return reduceCallback(null,[...acc, ...message.records]);
        },
        function(err, redResult) {
            try {
                collector.processLog(redResult, parseFun, null,
                    function(err) {
                        if (err) {
                            const skipped =  processError(context, err, redResult);
                            context.log.error(`Error while processing records. Skipped ${skipped} Records`);
                            return callback(err);
                        } else {
                            const processed = redResult.length;
                            context.log.info(`Processed: ${processed}`);
                        }
                        return callback(null, { processed: redResult, skipped: 0 });
                });
            } catch (exception) {
                const skipped = processError(context, exception, redResult);
                context.log.error(`Error while processing records. Skipped ${skipped} Records`);
                return callback(exception);
            }
            if (context.bindings.dlBlob) {
                context.bindings.dlBlob = JSON.stringify(context.bindings.dlBlob);
            }
    });
};
