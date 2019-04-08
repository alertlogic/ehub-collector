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

const master = rewire('../Master/index');


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

});

