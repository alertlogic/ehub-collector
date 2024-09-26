/* ----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 * 
 * Various Event hub collector health checks.
 * The last error code is EHUB000006
 * 
 * TODO: check 'alertlogic-dl' container exists.
 * 
 * @end
 * ----------------------------------------------------------------------------
 */
 
const async = require('async');

const ehubUtil = require('../common/util');


function checkEventHubNamespace(master, ns, callback) {
    const pState = ns.provisioningState;
    if (pState === 'Succeeded') {
        return callback(null, ns);
    } else {
        const err = master.errorStatusFmt(
            'EHUB000001',
            `Event Hub Namespace state is not ok. Namespace = ${ns.name}, provisioningState = ${pState}`);
        
        return callback(err);
    }
}

function checkEventHub(master, eventHubs, callback) {
    const ehubForLogName = ehubUtil.getEhubForLogName();
    // Keep array.reduce here in case we'd like to check other event hubs status.
    const check = eventHubs.reduce(function(acc, ehub) {
        acc.logEhubExists = acc.logEhubExists || ehub.name === ehubForLogName;
        if (acc.error) {
            return acc;
        } else if (ehub.name === ehubForLogName) {
            const status = ehub.status;
            if (status === 'Active') {
                return acc;
            } else {
                const nsName = ehubUtil.getEhubNsName();
                acc.error = master.errorStatusFmt(
                    'EHUB000002',
                    `Event Hub status is not ok. Namespace = ${nsName}, EventHub = ${ehub.name}, status = ${status}`);
                return acc;
            }
        } else {
            return acc;
        }
    }, {logEhubExists: false, error: null});
    
    if (!check.logEhubExists) {
        const nsName = ehubUtil.getEhubNsName();
        return callback(master.errorStatusFmt(
            'EHUB000006',
            `Event hub doesn't exist. Namespace = ${nsName}, EventHub = ${ehubForLogName}`));
    } else {
        return callback(check.error);
    }
}

function initArmEhub(master) {
    return ehubUtil.initArmEhub(master);
}

const eventHubNs = function(master, callback) {
    var armEhub = initArmEhub(master);
    const rg = ehubUtil.getEhubForLogResourceGroup(master);
    const nsName = ehubUtil.getEhubNsName();
    
    async.waterfall([
        function(callback){
            return armEhub.namespaces.get(rg, nsName, function (err, namespace, req, resp) {
                if (err) {
                    return callback(ehubUtil.formatSdkError(master, 
                        'EHUB000003',
                        `Failed to get Event Hub namespace. Resource group = ${rg}, Namespace = ${nsName}`,
                        err));
                } else {
                    return checkEventHubNamespace(master, namespace, callback);
                }
            });
        },
        function(namespace, callback) {
            return armEhub.eventHubs.listByNamespace(rg, namespace.name, function(err, eventHubs) {
                if (err) {
                    return callback(ehubUtil.formatSdkError(master,
                        'EHUB000004',
                        `Failed to list Event Hubs by namespace. Resource group = ${rg}, Namespace = ${namespace.name}`,
                        err));
                } else if (eventHubs.length === 0){
                    return callback(master.errorStatusFmt(
                        'EHUB000005',
                        `Event Hub Namespace contains zero event hubs. Namespace = ${namespace.name}`));
                } else {
                    return checkEventHub(master, eventHubs, callback);
                }
            });
        }
    ], callback);
};

module.exports = {
    eventHubNs: eventHubNs
};
