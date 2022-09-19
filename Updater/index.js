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
const envObj = require('./al-ehub-collector.json');


module.exports = function (context, AlertlogicUpdaterTimer) {
    var updater = new AlAzureUpdater();
    updater.setEnvForMigration(envObj,function(envError){
        if (envError) {
            context.log.error('Env failed:', envError);
        } else {
            context.log.info('Env OK');
        }
        context.done(envError);
    });
    updater.syncWebApp(function(syncError){
        if (syncError) {
            context.log.error('Site sync failed:', syncError);
        } else {
            context.log.info('Site sync OK');
        }
        context.done(syncError);
    });
};

