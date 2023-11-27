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
const formatLogs = require('./format').logRecord;
const invocations = require('../common/invocations');
module.exports = function (context, eventHubMessages) {
    return ehubCollector(context, eventHubMessages, formatLogs, null, function(err) {
        if (err) {
            invocations.logInvocationResult(context.executionContext.functionName, false);
        } else {
            invocations.logInvocationResult(context.executionContext.functionName, true);
        }
        context.done(err);
    });
};

