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

const async = require('async');
const pkg = require('../package.json');
const AlCollector = require('al-azure-collector-js').Collector;

module.exports = function (context, eventHubMessages) {
    var master = new AlCollector(context, 'ehub', pkg.version);
    
    context.log.error('Received:', eventHubMessages);
    context.done();
};

