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
 
const parse = require('parse-key-value');

const EhubCollectorMaster = require('./ehub_master').EhubCollectorMaster;
const invocations = require('../common/invocations');

const getRegisterConfig = function() {
    const ehubConnection = parse(process.env.APP_LOG_EHUB_CONNECTION);
    delete ehubConnection.SharedAccessKey;
    return { config: ehubConnection };
};

const setInvocations = function (master) {
    const counts = invocations.getInvocationCounts();
    const stats = Object.entries(counts).map(([functionName, { invocations, errors }]) => ({
        [functionName]: { invocations, errors }
    }));
    master._appStats.setFunctionStats(stats);
};

module.exports = async function (context, AlertlogicMasterTimer) {
    invocations.logInvocationResult(context.executionContext.functionName, true);
    const master = new EhubCollectorMaster(context);
    
    try {
        await master.register(getRegisterConfig());
        
        if (process.env.FUNCTIONS_EXTENSION_VERSION > '~3'){
            setInvocations(master);
        }
        
        const checkinResp = await master.checkin(AlertlogicMasterTimer.last);
        context.log.info('Ehub source checkin OK', checkinResp);
    } catch (error) {
        invocations.logInvocationResult(context.executionContext.functionName, false);
        context.log.error('Master error ', error);
        throw error;
    }
};