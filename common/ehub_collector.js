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
    const errorSample = {
        type: 'errorSample',
        errorMessage: err.message,
        erroCode: err.statusCode || err.status 
    };
    // We're going to ignore 400s from ingest right now. Do not put them in the DLQ
    if((err.statusCode >= 400 && err.statusCode < 500) || (err.status >= 400 && err.status < 500) ){
        return skipped;
    }
    // Otherwise, we need to put them in the DLQ
    else if (context.bindings.dlBlob && context.bindings.dlBlob instanceof Array) {
        context.bindings.dlBlob.push({errorSample, messages});
    } else {
        context.bindings.dlBlob = [{errorSample, messages}];
    }
    return skipped;
};

module.exports = function (context, rawMessages, parseFun, processErrorFun, callback) {
    // the ehub collector my very well receive messages not in json format, in this case we need to wrap it in an objet that teh collector expects 
    const eventHubMessages = rawMessages.map(message => {
        try{
            const parsedMessage = JSON.parse(message);
            return parsedMessage.records ? parsedMessage : {records:[parsedMessage]};
        } catch(e){
            return {records:[message]};
        }
    });

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
                            context.log.error(`Error: ${err}`);
                            return callback(null, { processed: 0, skipped });
                        } else {
                            const processed = redResult.length;
                            context.log.info(`Processed: ${processed}`);
                        }
                        return callback(null, { processed: redResult.length, skipped: 0 });
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
