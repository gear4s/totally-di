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

        context('start', function () {

            it('successfully resolves a dependency', function (done) {

                var container = new Container();
                container.bind('Dependency1', Dependency1);
                container.bind('Dependency2', Dependency2);
                container.bind('Obj1', Obj1, [Dependency1, Dependency2]);

                var obj1 = container.resolve('Obj1');

                obj1.testMethod(function (err, result) {
                    done();
                });
            });
        });
    });
});