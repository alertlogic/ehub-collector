/* ----------------------------------------------------------------------------
 * @copyright (C) 2021, Alert Logic, Inc
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

const pkg = require('../package.json');
const AlAzureMaster = require('@alertlogic/al-azure-collector-js').AlAzureMaster;
const healthcheck = require('./healthcheck');

const APP_FUNCTIONS = ['Master', 'Updater', 'EHubGeneral', 'DLBlob'];

class EhubCollectorMaster extends AlAzureMaster {
    constructor(context) {
        const healthFuns = [
            healthcheck.eventHubNs
        ];
        super(context, 'ehub', pkg.version, healthFuns, null, {}, {}, APP_FUNCTIONS);
    }
    
    getConfigAttrs() {
        let baseAttrs = super.getConfigAttrs();
        let ehubConnection = parse(process.env.APP_LOG_EHUB_CONNECTION);
        delete ehubConnection.SharedAccessKey;
        
        baseAttrs.ehub_name = process.env.APP_LOG_EHUB_NAME;
        baseAttrs.ehub_rg = process.env.APP_LOG_EHUB_RESOURCE_GROUP;
        baseAttrs.ehub_cg = process.env.APP_LOG_EHUB_CONSUMER_GROUP;
        baseAttrs.ehub_connection = ehubConnection;
        return baseAttrs;
    }
}


module.exports = {
    EhubCollectorMaster
};

