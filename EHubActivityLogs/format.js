/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 *
 * The function to format records from 'insights-operational-logs'
 * @end
 * -----------------------------------------------------------------------------
 */

const parse = require('../common/parse');

const logRecord = function(msg) {
    const ts = parse.getMsgTs(msg);
    const typeId = parse.getMsgTypeId(msg);
    return {
        messageTs: ts.sec,
        priority: 11,
        progName: 'EHubActivityLogs',
        pid: undefined,
        message: JSON.stringify(msg),
        messageType: 'json/azure.ehub',
        messageTypeId: typeId,
        messageTsUs: ts.usec
    };
};

module.exports = {
    logRecord: logRecord
};