/* ----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 * 
 * The purpose of this function is to check updates of collector configuration,
 * reconfigure them if needed and send status report into Alert Logic monitoring service.
 * 
 * @end
 * ----------------------------------------------------------------------------
 */
 
const async = require('async');
const azure = require('azure');

const ehubCollector = require('../common/ehub_collector');
const ehubActivityLogsFormat = require('../EHubActivityLogs/format');
const ehubGeneralFormat = require('../EHubGeneral/format');

const CONCURRENT_BLOB_PROCESS_NUM = 20;

function getCollectorFunName(blobName) {
    return blobName.split('/')[1];
}

var collectorProcessError = function(context, err, messages) {
    context.log.error('Error processing batch:', err);
    var skipped = messages.records ? messages.records.length : messages.length;
    context.log.error('Records skipped:', skipped);
    return context;
};

function processDLBlob(blobService, context, blob, callback) {
    context.log.verbose('Processing blob: ', blob.name);
    var collectorFormatFun;
    
    switch(getCollectorFunName(blob.name)) {
        case 'ehubactivitylogs':
            collectorFormatFun =  ehubActivityLogsFormat;
            break;
        case 'ehugeneral':
            collectorFormatFun =  ehubGeneralFormat;
            break;
        default:
            collectorFormatFun =  ehubGeneralFormat;
            break;
    }
    
    async.waterfall([
        function(callback) {
            return blobService.getBlobToText(process.env.APP_DL_CONTAINER_NAME, blob.name, callback);
        },
        function(blobData, blobReq, blobResp, callback) {
            try {
                return ehubCollector(context, [JSON.parse(blobData)], collectorFormatFun, collectorProcessError, callback);
            } catch (ex) {
                return callback(ex);
            }
        },
        function(callback) {
            return blobService.deleteBlob(process.env.APP_DL_CONTAINER_NAME, blob.name, callback);
        }
    ], callback);
}

module.exports = function (context, AlertlogicDLBlobTimer) {
    const blobService = azure.createBlobService(process.env.AzureWebJobsStorage);
    const options = {
        maxResults: parseInt(process.env.DL_BLOB_PAGE_SIZE)
    };
    blobService.listBlobsSegmentedWithPrefix(
        process.env.APP_DL_CONTAINER_NAME,
        process.env.WEBSITE_SITE_NAME,
        null, options,
        function(listErr, data) {
            if (listErr) {
                context.done(listErr);
            } else {
                context.log.verbose('Listed blobs: ', data.entries.length);
                async.eachLimit(data.entries, CONCURRENT_BLOB_PROCESS_NUM, function(blob, callback) {
                    return processDLBlob(blobService, context, blob, callback);
                }, function(processErr) {
                    context.done(processErr);
                });
            }
    });
};

