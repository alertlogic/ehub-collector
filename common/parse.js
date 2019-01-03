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

/*
 * For the ISO8601 timestamp, '2018-12-19T08:18:21.1834546Z'
 */
const ISO8601_MICROSEC_OFFSET = 23;

var getProp = function(path, obj, defaultVal = null) {
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
    if (isNaN(milli)) {
        return defaultTs();
    } else {
        var micro = parseTsUsec(ts);
        return {
            msec: milli,
            usec: micro
        };
    }
};

var parseTsUsec = function(ts) {
    var micro = null;
    try {
        // extracts microseconds from ISO8601 timestamp, like '2018-12-19T08:18:21.1834546Z'
        if (ts.length > ISO8601_MICROSEC_OFFSET) {
            micro = Number.parseInt(ts.slice(ISO8601_MICROSEC_OFFSET).replace(/[Z]/, ''));
        }
        return micro;
    } catch (err) {
        // Unable to get microseconds from a timestamp. Do nothing.
        return null;
    }
};

var iteratePropPaths = function(paths, msg) {
    return paths.reduce(function(acc, v) {
        if (acc) {
            return acc;
        } else {
            return getProp(v, msg);
        }
    }, null);
};

var getMsgTs = function(msg) {
    var msgTs = iteratePropPaths(tsPaths, msg);
    return msgTs ? parseTs(msgTs) : defaultTs();
};

var getMsgType = function(msg, defaultVal) {
    var msgType = iteratePropPaths(typePaths, msg);
    return msgType ? msgType : defaultVal;
};

module.exports = {
    getMsgTs: getMsgTs,
    getMsgType: getMsgType
};

