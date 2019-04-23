/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 *
 * Message timestamp and type property paths are based on Azure event schema definitions
 * https://docs.microsoft.com/en-us/azure/azure-monitor/platform/activity-log-schema#mapping-to-diagnostic-logs-schema
 * https://docs.microsoft.com/en-us/azure/azure-monitor/platform/tutorial-dashboards
 *
 * @end
 * -----------------------------------------------------------------------------
 */

const parse = require('@alertlogic/al-collector-js').Parse;

const typeIdPaths = [
    { path: ['category', 'value'] },
    { path: ['category'] },
    { path: ['operationName', 'value'] },
    { path: ['operationName'] },
    { path: ['RecordType'] },
    { path: ['Operation'] },
    { path: ['properties', 'category']},
    { path: ['properties', 'Category']}
];

const tsPaths = [
    { path: ['eventTimestamp'] },
    { path: ['time'] },
    { path: ['CreationTime'] }
];


const logRecord = function(msg) {
    const ts = parse.getMsgTs(msg, tsPaths);
    const typeId = parse.getMsgTypeId(msg, typeIdPaths);
    let formattedMsg = {
        messageTs: ts.sec,
        priority: 11,
        progName: 'EHubGeneral',
        message: JSON.stringify(msg),
        messageType: 'json/azure.ehub'
    };
    
    if (typeId) {
        Object.assign(formattedMsg, {messageTypeId: `${typeId}`});
    }
    if (ts.usec) {
        Object.assign(formattedMsg, {messageTsUs: ts.usec});
    }
    return formattedMsg;
};

module.exports = {
    logRecord: logRecord
};




