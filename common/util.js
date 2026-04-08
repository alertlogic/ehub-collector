/* -----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 *
 * Common utilities specific to event hub collector.
 * @end
 * -----------------------------------------------------------------------------
 */

const {MonitorManagementClient} = require('@azure/arm-monitor');
const {EventHubManagementClient} = require('@azure/arm-eventhub');
const {RestError} = require('@azure/core-rest-pipeline');
const parse = require('parse-key-value');

const DEFAULT_EHUB_FOR_LOG_NAME = 'alertlogic-log';
let eventHubClient = null;
const initArmMonitor = function(master) {
    const azureCreds = master.getApplicationTokenCredentials();
    const subscriptionId = master.getConfigAttrs().subscription_id;
    return new MonitorManagementClient(azureCreds, subscriptionId);
};

const initArmEhub = function(master) {
    if (!eventHubClient) {
        const azureCreds = master.getApplicationTokenCredentials();
        const subscriptionId = master.getConfigAttrs().subscription_id;
        eventHubClient = new EventHubManagementClient(azureCreds, subscriptionId);
    }
    return eventHubClient;
};

const formatSdkError = function (master, alErrorCode, message, err) {
    if (err instanceof RestError) {
        // RestError defines request/response as non-enumerable, so JSON.stringify is safe.
        // Explicitly extract known safe fields to be certain no auth headers are included.
        const details = {
            code: err.code,
            statusCode: err.statusCode,
            message: err.message,
            name: err.name
        };
        if (err.details !== undefined) details.details = err.details;
        return master.errorStatusFmt(alErrorCode, message + ' Error: ' + JSON.stringify(details));
    } else if (typeof err === 'string' || err instanceof String) {
        return master.errorStatusFmt(alErrorCode, message + ' Error: ' + err);
    } else if (typeof err === 'object') {
        return master.errorStatusFmt(alErrorCode, message + ' Error: ' + JSON.stringify(err));
    } else {
        return master.errorStatusFmt(alErrorCode, message);
    }
};

const getEhubNsName = function() {
    const connectionParams = parse(process.env.APP_LOG_EHUB_CONNECTION);
    return connectionParams.Endpoint.split(/[\.\/]/g)[2];
};

const getEhubForLogName = function() {
    return process.env.APP_LOG_EHUB_NAME ? process.env.APP_LOG_EHUB_NAME : DEFAULT_EHUB_FOR_LOG_NAME;
};

const getEhubForLogResourceGroup = function(master) {
    return process.env.APP_LOG_EHUB_RESOURCE_GROUP ?
        process.env.APP_LOG_EHUB_RESOURCE_GROUP : master.getConfigAttrs().app_resource_group;
};

module.exports = {
    getEhubNsName: getEhubNsName,
    getEhubForLogName: getEhubForLogName,
    getEhubForLogResourceGroup: getEhubForLogResourceGroup,
    formatSdkError: formatSdkError,
    initArmMonitor: initArmMonitor,
    initArmEhub: initArmEhub
};

