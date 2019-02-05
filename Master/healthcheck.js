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
    const check = eventHubs.reduce(function(acc, ehub) {
        acc.logHubExists = acc.logHubExists || ehub.name === 'alertlogic-log';
        if (acc.error) {
            return acc;
        } else {
            const status = ehub.status;
            
            if (status === 'Active') {
                return acc;
            } else {
                acc.error = master.errorStatusFmt(
                    'EHUB000002',
                    `Event Hub status is not ok. EventHub = ${ehub.name}, status = ${status}`);
                return acc;
            }
            
        }
    }, {logHubExists: false, error: null});
    
    if (!check.logHubExists) {
        return callback(master.errorStatusFmt(
            'EHUB000006',
            `Default alertlogic-log event hub doesn't exist in the namespace.`));
    } else {
        return callback(check.error);
    }
}

const eventHubNs = function(master, callback) {
    var armEhub = ehubUtil.initArmEhub(master);
    const rg = master.getConfigAttrs().app_resource_group;
    const nsName = ehubUtil.getEhubNsName();
    
    async.waterfall([
        function(callback){
            return armEhub.namespaces.get(rg, nsName, function (err, namespace, req, resp) {
                if (err) {
                    return callback(ehubUtil.formatSdkError(master, 'EHUB000003', err));
                } else {
                    return checkEventHubNamespace(master, namespace, callback);
                }
            });
        },
        function(namespace, callback) {
            return armEhub.eventHubs.listByNamespace(rg, namespace.name, function(err, eventHubs) {
                if (err) {
                    return callback(ehubUtil.formatSdkError(master, 'EHUB000004', err));
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
