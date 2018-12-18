/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 *
 * The purpose of this Azure function is to parse and send Event Hub event to AlertLogic
 * ingestion service.
 *
 * @end
 * -----------------------------------------------------------------------------
 */

const pkg = require('../package.json');
const AlAzureCollector = require('al-azure-collector-js').AlAzureCollector;

module.exports = function (context, eventHubMessages) {
    var collector = new AlAzureCollector(context, 'ehub', pkg.version);
    
    context.log.error('Received:', eventHubMessages);
    context.done();
};

