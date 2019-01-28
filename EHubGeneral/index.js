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

module.exports = function (context, eventHubMessages) {
    return ehubCollector(context, eventHubMessages, formatLogs, null, function(err) {
        context.done(err);
    });
};

