/* ----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 * 
 * Event hub collection statistics report.
 * The last error code is EHUB000101
 * 
 * 
 * @end
 * ----------------------------------------------------------------------------
 */
 
const async = require('async');
const moment = require('moment');

const ehubUtil = require('../common/util');

function getMetric(metricName, metrics) {
    const m = metrics.value.find((e) => { return e.name.value === metricName; });
    return m.timeseries[0].data[0].total;
}

const getEventHubCollectionMetrics = function(master, timestamp, callback) {
    var armMonitor = ehubUtil.initArmMonitor(master);
    var armEhub = ehubUtil.initArmEhub(master);
    const rg = master.getConfigAttrs().app_resource_group;
    const nsName = ehubUtil.getEhubNsName();
    
    async.waterfall([
        function(callback){
            return armEhub.namespaces.get(rg, nsName, function (err, namespace, req, resp) {
                if (err) {
                    return callback(ehubUtil.formatSdkError(master, 'EHUB000100', err));
                } else {
                    return callback(null, namespace);
                }
            });
        },
        function(namespace, callback) {
            const endTs = moment.utc(timestamp);
            const startTs = moment.utc(timestamp).subtract(15, 'minutes');
            const options = {
                metricnames: 'OutgoingMessages,OutgoingBytes',
                timespan: startTs.utc().format() + '/' + endTs.utc().format(),
                interval: moment.duration(15, 'minutes')
            };
            return armMonitor.metrics.list(namespace.id, options, function(err, metrics) {
                if (err) {
                    return callback(ehubUtil.formatSdkError(master, 'EHUB000101', err));
                } else {
                    const stats = {
                        bytes: getMetric('OutgoingBytes', metrics),
                        events: getMetric('OutgoingMessages', metrics)
                    };
                    return callback(null, stats);
                }
            });
        }
    ], callback);
};

module.exports = {
    getEventHubCollectionMetrics: getEventHubCollectionMetrics
};
