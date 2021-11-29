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
const parse = require('parse-key-value');

const EhubCollectorMaster = require('./ehub_master').EhubCollectorMaster;

var getRegisterConfig = function() {
    var ehubConnection = parse(process.env.APP_LOG_EHUB_CONNECTION);
    delete ehubConnection.SharedAccessKey;
    return { config: ehubConnection };
};

module.exports = function (context, AlertlogicMasterTimer) {
    var master = new EhubCollectorMaster(context);
    async.waterfall([
        function(asyncCallback) {
            return master.register(getRegisterConfig(), asyncCallback);
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

