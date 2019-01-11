/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 *
 * The function captures logs from a general purpose Event hub.
 *
 * @end
 * -----------------------------------------------------------------------------
 */


const ehubCollector = require('../common/ehub_collector');
const parse = require('../common/parse');

var formatGeneralLogRecord = function(msg) {
    const ts = parse.getMsgTs(msg);
    const typeId = parse.getMsgTypeId(msg);
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
    return ehubCollector(context, eventHubMessages, formatGeneralLogRecord);
};


