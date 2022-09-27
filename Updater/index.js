/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 *
 * The purpose of this function is to sync web app every 12 hours with
 * external git repository in order to perform continious updates.
 * https://docs.microsoft.com/en-us/rest/api/appservice/webapps#WebApps_SyncRepository
 *
 * @end
 * -----------------------------------------------------------------------------
 */

const AlAzureUpdater = require('@alertlogic/al-azure-collector-js').AlAzureUpdater;


module.exports = function (context, AlertlogicUpdaterTimer) {
    var updater = new AlAzureUpdater();
    if(!process.env.AZURE_FUN_UPDATE_CONFIG_NAME){
        process.env.AZURE_FUN_UPDATE_CONFIG_NAME='al-ehub-collector.json';
    }
    updater.run(function(syncError){
        if (syncError) {
            context.log.error('Site sync and env set failed:', syncError);
        } else {
            context.log.info('Site sync and env OK');
        }
        context.done(syncError);
    });
};

