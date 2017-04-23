var expect = require('expect.js');
var path = require('path');

var Container = require('../lib/container');
var Obj1 = require('./lib/obj-1');
var Dependency1 = require('./lib/dependency-1');
var Dependency2 = require('./lib/dependency-2');

describe('unit - container', function () {

    this.timeout(30000);

    context('', function () {

        beforeEach('setup', function (done) {

            done();
        });

        afterEach('stop', function (done) {
            done();
        });

        it('successfully resolves a static object', function(done){
            // TODO
            done();
        });

        it('successfully resolves a dependency tree', function (done) {

            var container = new Container();

            container.register('Bob', Dependency1);
            container.register('Mary', Dependency2);
            container.register('Joe', Obj1, ['Bob', 'Mary']);

            var obj1 = container.resolve('Joe');

            obj1.testMethod(function (err, result) {
                expect(result).to.equal('success');
                done();
            });
        });
    });
});