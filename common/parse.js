/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 *
 * Message parse utilities common for event hub collector functions.
 * Message timestamp and type proprty paths are based on Azure event schema definitions
 * https://docs.microsoft.com/en-us/azure/azure-monitor/platform/activity-log-schema#mapping-to-diagnostic-logs-schema
 * https://docs.microsoft.com/en-us/azure/azure-monitor/platform/tutorial-dashboards
 *
 * @end
 * -----------------------------------------------------------------------------
 */

const typePaths = [
    ['operationName', 'value'],
    ['operationName'],
    ['category', 'value'],
    ['category'],
];

const tsPaths = [
    ['eventTimestamp'],
    ['time']
];

const getProp = function(path, obj, defaultVal = null) {
    var reduceFun = function(xs, x) {
        return (xs && xs[x]) ? xs[x] : defaultVal;
    };
    return path.reduce(reduceFun, obj);
};

var defaultTs = function() {
    return {
        msec: Date.now(),
        usec: null
    };
};

var parseTs = function(ts) {
    var milli = Date.parse(ts);
    var micro = null;
    try {
        // parses '2018-12-19T08:18:21.1834546Z'
        if (ts.length > 23) {
            micro = Number.parseInt(ts.slice(23).replace(/[a-zA-Z]/, ''));
        }
        return {
            msec: milli,
            usec: micro
        };
    } catch (err) {
        // Unable to get microseconds from a timestamp. Do nothing.
        return {
            msec: milli,
            usec: null
        };
    }
};

var getMsgTs = function(msg) {
    var msgTs = tsPaths.reduce(function(acc, v) {
        if (acc) {
            return acc;
        } else {
            return getProp(v, msg);
        }
    }, null);
    return msgTs ? parseTs(msgTs) : defaultTs();
};

var getMsgType = function(msg, defaultVal) {
    var msgType = typePaths.reduce(function(acc, v) {
        if (acc) {
            return acc;
        } else {
            return getProp(v, msg);
        }
    }, null);
    
    return msgType ? msgType : defaultVal;
};

module.exports = {
    getMsgTs: getMsgTs,
    getMsgType: getMsgType
};

