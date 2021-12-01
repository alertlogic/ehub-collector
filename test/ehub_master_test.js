/* -----------------------------------------------------------------------------
 * @copyright (C) 2019, Alert Logic, Inc
 * @doc
 * 
 * Unit tests for Master function
 * 
 * @end
 * -----------------------------------------------------------------------------
 */
 
const assert = require('assert');
const rewire = require('rewire');
const mock = require('./mock');
const pkg = require('../package.json');

const master = rewire('../Master/index');
const EhubCollectorMaster = require('../Master/ehub_master').EhubCollectorMaster;


describe('Event hub Master function unit tests.', function() {
    before(function() {
        private_getRegisterConfig = master.__get__('getRegisterConfig');
    });
    
    after(function() {
        delete process.env.APP_LOG_EHUB_CONNECTION;
    });
    
    it('Simple OK test, activity record', function(done) {
        process.env.APP_LOG_EHUB_CONNECTION =  'Endpoint=sb://alertlogicingest-westeurope-vv7gloy2am6u2.servicebus.windows.net/;SharedAccessKeyName=kkread;SharedAccessKey=some+key;EntityPath=insights-operational-logs'; 
        const actual = private_getRegisterConfig();
        const expected = { 
            config: {
                Endpoint: 'sb://alertlogicingest-westeurope-vv7gloy2am6u2.servicebus.windows.net/',
                SharedAccessKeyName: 'kkread',
                EntityPath: 'insights-operational-logs'
            }
        };
        assert.deepEqual(actual, expected);
        done();
    });
    
    it('getConfigAttrs test', function(done) {
        process.env.APP_LOG_EHUB_CONNECTION =  'Endpoint=sb://alertlogicingest-westeurope-vv7gloy2am6u2.servicebus.windows.net/;SharedAccessKeyName=kkread;SharedAccessKey=some+key;EntityPath=insights-operational-logs'; 
        process.env.APP_LOG_EHUB_NAME = 'event-hub-name';
        process.env.APP_LOG_EHUB_RESOURCE_GROUP = 'event-hub-rg';
        process.env.APP_LOG_EHUB_CONSUMER_GROUP = 'event-hub-cg';
        
        var master = new EhubCollectorMaster(mock.context);
        
        const expected = {
            version: pkg.version,
            app_filter_json: '',
            app_filter_regex: '',
            web_app_name: 'test-site',
            app_resource_group: 'kktest11-rg',
            app_tenant_id: 'tenant-id',
            subscription_id: 'subscription-id',
            ehub_name: 'event-hub-name',
            ehub_rg: 'event-hub-rg',
            ehub_cg: 'event-hub-cg',
            ehub_connection: {
                Endpoint: 'sb://alertlogicingest-westeurope-vv7gloy2am6u2.servicebus.windows.net/',
                SharedAccessKeyName: 'kkread',
                EntityPath: 'insights-operational-logs'
            }
        };
        
        const actual = master.getConfigAttrs();
        
        delete process.env.APP_LOG_EHUB_NAME;
        delete process.env.APP_LOG_EHUB_RESOURCE_GROUP;
        delete process.env.APP_LOG_EHUB_CONSUMER_GROUP;
        
        assert.deepEqual(actual, expected);
        
        done();
    });

});

