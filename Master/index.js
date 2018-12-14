/* ----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 * 
 * The purpose of this function is to check updates of collector configuration,
 * reconfigure them if needed and send status report into Alert Logic monitoring service.
 * 
 * @end
 * ----------------------------------------------------------------------------
 */
 
const async = require('async');
const pkg = require('../package.json');
const AlMaster = require('al-azure-collector-js').Master;

module.exports = function (context, AlertlogicMasterTimer) {
    var master = new AlMaster(context, 'ehub', pkg.version);
    async.waterfall([
        function(asyncCallback) {
            return master.register({}, asyncCallback);
        },
        function(hostId, sourceId, asyncCallback) {
            return master.checkin(AlertlogicMasterTimer.last,
                function(checkinError, checkinResp) {
                    if (azcollectError) {
                        return asyncCallback(`Checkin failed ${azcollectError}`);
                    }
                    context.log.info('Ehub source checkin OK', checkinResp);
                    return asyncCallback(null);
                });
        }],
    function(error, results) {
        if (error) {
            context.log.error('Master error ', error);
        }
        context.done(error);
    });
};

