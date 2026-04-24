/* -----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 *
 * Common Azure Event Hub collector function implementation
 *
 * @end
 * -----------------------------------------------------------------------------
 */

const pkg = require('../package.json');
const AlAzureCollector = require('@alertlogic/al-azure-collector-js').AlAzureCollector;

// Batch processing constants
const HTTP_ERROR_MIN = 400;                // Min HTTP error status code
const HTTP_ERROR_MAX = 500;                // Max HTTP error status code (exclusive)

const defaultProcessError = function(context, err, messages) {
    context.log.error('Error processing batch:', err);
    const skipped = messages.length;
    const errorSample = {
        type: 'errorSample',
        errorMessage: err.message,
        erroCode: err.statusCode || err.status 
    };
    // We're going to ignore 400s from ingest right now. Do not put them in the DLQ
    if((err.statusCode >= HTTP_ERROR_MIN && err.statusCode < HTTP_ERROR_MAX) || (err.status >= HTTP_ERROR_MIN && err.status < HTTP_ERROR_MAX) ){
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

module.exports = async function (context, rawMessages, parseFun, processErrorFun) {
    // the ehub collector my very well receive messages not in json format, in this case we need to wrap it in an object that the collector expects 
    const eventHubMessages = rawMessages.map(message => {
        try{
            const parsedMessage = JSON.parse(message);
            return parsedMessage.records ? parsedMessage : {records:[parsedMessage]};
        } catch(e){
            return {records:[message]};
        }
    });

    const processError = processErrorFun ? processErrorFun : defaultProcessError;
    const collector = new AlAzureCollector(context, 'ehub', pkg.version);
    
    // Flatten all records from all messages
    const allRecords = eventHubMessages.reduce((acc, message) => {
        return [...acc, ...message.records];
    }, []);

    try {
        await collector.processLog(allRecords, parseFun, null);
        const processed = allRecords.length;
        context.log.info(`Processed: ${processed}`);
        
        if (context.bindings.dlBlob && typeof context.bindings.dlBlob === 'object') {
            context.bindings.dlBlob = JSON.stringify(context.bindings.dlBlob);
        }
        
        return { processed: allRecords.length, skipped: 0 };
    } catch (err) {
        const skipped = processError(context, err, allRecords);
        context.log.error(`Error while processing records. Skipped ${skipped} Records`);
        context.log.error(`Error: ${err}`);
        
        if (context.bindings.dlBlob && typeof context.bindings.dlBlob === 'object') {
            context.bindings.dlBlob = JSON.stringify(context.bindings.dlBlob);
        }
        
        return { processed: 0, skipped };
    }
};
