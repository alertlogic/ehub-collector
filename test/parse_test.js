/* -----------------------------------------------------------------------------
 * @copyright (C) 2018, Alert Logic, Inc
 * @doc
 * 
 * Unit tests for EHub functions
 * 
 * @end
 * -----------------------------------------------------------------------------
 */
 
var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var mock = require('./mock');

var parse = rewire('../common/parse');

describe('Common parse functions unit tests.', function() {
    var clock;
    
    before(function() {
        clock = sinon.useFakeTimers({now: 1234567890});
    });
    after(function() {
        clock.restore();
    });
    
    it('Simple OK test', function(done) {
        var privGetProp = parse.__get__('getProp');
        var obj = {
            a: {
                aa: 1,
                ab: 2
            },
            b: 2,
            c: 3
        };
        assert.equal(privGetProp(['a', 'aa'], obj), 1);
        assert.equal(privGetProp(['b'], obj), 2);
        assert.deepEqual(privGetProp(['a'], obj), {aa: 1, ab: 2});
        
        done();
    });
    
    it('Empty path', function(done) {
        var privGetProp = parse.__get__('getProp');
        var obj = {
            a: {
                aa: 1,
                ab: 2
            },
            b: 2,
            c: 3
        };
        assert.deepEqual(privGetProp([], obj), obj);
        
        done();
    });
    
    it('Empty obj', function(done) {
        var privGetProp = parse.__get__('getProp');
        assert.deepEqual(privGetProp(['a'], {}), null);
        
        done();
    });
    
    it('Wrong path', function(done) {
        var privGetProp = parse.__get__('getProp');
        var obj = {
            a: {
                aa: 1,
                ab: 2
            },
            b: 2,
            c: 3
        };
        assert.deepEqual(privGetProp(['d'], obj), null);
        assert.deepEqual(privGetProp(['d', 'da'], obj), null);
        
        done();
    });
    
    it('Ok test with default', function(done) {
        var privGetProp = parse.__get__('getProp');
        var obj = {
            a: {
                aa: 1,
                ab: 2
            },
            b: 2,
            c: 3
        };
        assert.deepEqual(privGetProp(['d'], obj, 'default'), 'default');
        assert.deepEqual(privGetProp(['d', 'da'], obj, 'default'), 'default');
        
        done();
    });
    
    it('Parse timestamp ISO-8601', function(done) {
        var privParseTs = parse.__get__('parseTs');
        assert.deepEqual(privParseTs('2018-12-19T08:18:21.13Z'), {msec: 1545207501130, usec: null});
        assert.deepEqual(privParseTs('2018-12-19T08:18:21Z'), {msec: 1545207501000, usec: null});
        assert.deepEqual(privParseTs('2018-12-19T08:18:21.1357685Z'), {msec: 1545207501135, usec: 7685});
        
        done();
    });
    
    it('Wrong timestamp input', function(done) {
        var privParseTs = parse.__get__('parseTs');
        assert.deepEqual(privParseTs('foo'), {msec: 1234567890, usec: null});
        
        done();
    });
    
});

