/* -----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 *
 * Common utilities specific to event hub collector.
 * @end
 * -----------------------------------------------------------------------------
 */

const azure = require('azure');
const parse = require('parse-key-value');

const initArmMonitor = function(master) {
    const azureCreds = master.getApplicationTokenCredentials();
    const subscriptionId = master.getConfigAttrs().subscription_id;
    return azure.createMonitorManagementClient(azureCreds, subscriptionId);
};

const initArmEhub = function(master) {
    const azureCreds = master.getApplicationTokenCredentials();
    const subscriptionId = master.getConfigAttrs().subscription_id;
    return azure.createEventHubManagementClient(azureCreds, subscriptionId);
};

const formatSdkError = function (master, alErrorCode, err) {
    if (typeof err === 'string' || err instanceof String) {
        return master.errorStatusFmt(alErrorCode, err);
    } else if (typeof err === 'object') {
        return master.errorStatusFmt(alErrorCode, JSON.stringify(err));
    }
};

const getEhubNsName = function() {
    const connectionParams = parse(process.env.APP_LOG_EHUB_CONNECTION);
    return connectionParams.Endpoint.split(/[\.\/]/g)[2];
};


module.exports = {
    getEhubNsName: getEhubNsName,
    formatSdkError: formatSdkError,
    initArmMonitor: initArmMonitor,
    initArmEhub: initArmEhub
};

