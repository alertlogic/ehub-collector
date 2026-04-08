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

module.exports = async function (context, eventHubMessages) {
    try {
        await ehubCollector(context, eventHubMessages, formatLogs, null);
        invocations.logInvocationResult(context.executionContext.functionName, true);
        context.log.info('EHubGeneral OK');
    } catch (err) {
        invocations.logInvocationResult(context.executionContext.functionName, false);
        context.log.error('EHubGeneral error:', err);
        throw err;
    }
};