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
const AlAzureMaster = require('al-azure-collector-js').AlAzureMaster;

module.exports = function (context, AlertlogicMasterTimer) {
    var master = new AlAzureMaster(context, 'ehub', pkg.version);
    async.waterfall([
        function(asyncCallback) {
            return master.register({}, asyncCallback);
        },
        function(hostId, sourceId, asyncCallback) {
            return master.checkin(AlertlogicMasterTimer.last,
                function(checkinError, checkinResp) {
                    if (checkinError) {
                        return asyncCallback(`Checkin failed ${checkinError}`);
                    }
                    context.log.info('Ehub source checkin OK', checkinResp);
                    return asyncCallback(null, {});
                });
        }],
    function(error, results) {
        if (error) {
            context.log.error('Master error ', error);
        }
        context.done(error);
    });
};

