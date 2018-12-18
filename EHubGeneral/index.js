/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 *
 * The function captures logs from a general purpose Event hub.
 *
 * @end
 * -----------------------------------------------------------------------------
 */

const pkg = require('../package.json');
const AlAzureCollector = require('al-azure-collector-js').AlAzureCollector;

module.exports = function (context, eventHubMessages) {
    var collector = new AlAzureCollector(context, 'ehub', pkg.version);
    
    context.log.error('Received:', JSON.stringify(eventHubMessages));
    context.done();
};

