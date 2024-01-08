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
const invocations = require('../common/invocations');
var getRegisterConfig = function() {
    var ehubConnection = parse(process.env.APP_LOG_EHUB_CONNECTION);
    delete ehubConnection.SharedAccessKey;
    return { config: ehubConnection };
};

var setInvocations = function (master) {
    const counts = invocations.getInvocationCounts();
    const stats = Object.entries(counts).map(([functionName, { invocations, errors }]) => ({
        [functionName]: { invocations, errors }
    }));
    master._appStats.setFunctionStats(stats);
};

module.exports = function (context, AlertlogicMasterTimer) {
    invocations.logInvocationResult(context.executionContext.functionName, true);
    var master = new EhubCollectorMaster(context);
    async.waterfall([
        function(asyncCallback) {
            return master.register(getRegisterConfig(), asyncCallback);
        },
        function(hostId, sourceId, asyncCallback) {
            if (process.env.FUNCTIONS_EXTENSION_VERSION > '~3'){
                setInvocations(master);
            }
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
            invocations.logInvocationResult(context.executionContext.functionName, false);
            context.log.error('Master error ', error);
        }
        context.done(error);
    });
};

