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
 
const ehubUtil = require('../common/util');

function checkEventHubNamespace(master, ns) {
    const pState = ns.provisioningState;
    if (pState === 'Succeeded') {
        return ns;
    } else {
        throw master.errorStatusFmt(
            'EHUB000001',
            `Event Hub Namespace state is not ok. Namespace = ${ns.name}, provisioningState = ${pState}`);
    }
}

function checkEventHub(master, eventHubs) {
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
        throw master.errorStatusFmt(
            'EHUB000006',
            `Event hub doesn't exist. Namespace = ${nsName}, EventHub = ${ehubForLogName}`);
    } else if (check.error) {
        throw check.error;
    }
}

function initArmEhub(master) {
    return ehubUtil.initArmEhub(master);
}

const eventHubNs = async function(master) {
    const armEhub = initArmEhub(master);
    const rg = ehubUtil.getEhubForLogResourceGroup(master);
    const nsName = ehubUtil.getEhubNsName();
    
    // Get the namespace
    let namespace;
    try {
        namespace = await armEhub.namespaces.get(rg, nsName);
    } catch (err) {
        throw ehubUtil.formatSdkError(master, 
            'EHUB000003',
            `Failed to get Event Hub namespace. Resource group = ${rg}, Namespace = ${nsName}`,
            err);
    }

    // Check namespace is OK
    checkEventHubNamespace(master, namespace);

    // List event hubs
    const eventHubs = [];
    try {
        for await (const eventHub of armEhub.eventHubs.listByNamespace(rg, namespace.name)) {
            eventHubs.push(eventHub);
        }
    } catch (err) {
        throw ehubUtil.formatSdkError(master,
            'EHUB000004',
            `Failed to list Event Hubs by namespace. Resource group = ${rg}, Namespace = ${namespace.name}`,
            err);
    }

    if (eventHubs.length === 0) {
        throw master.errorStatusFmt(
            'EHUB000005',
            `Event Hub Namespace contains zero event hubs. Namespace = ${namespace.name}`);
    }

    // Check event hub
    checkEventHub(master, eventHubs);
    
    return null;
};

module.exports = {
    eventHubNs: eventHubNs
};
