var expect = require('expect.js');
var path = require('path');

var Container = require('../lib/container');
var Obj1 = require('./lib/obj-1');
var Obj2 = require('./lib/obj-2');
var Obj3 = require('./lib/obj-3');
var Dependency1 = require('./lib/dependency-1');
var Dependency2 = require('./lib/dependency-2');
var Dependency3 = require('./lib/dependency-3');

describe('unit - container', function () {

    this.timeout(30000);

    context('', function () {

        beforeEach('setup', function (done) {

            done();
        });

        afterEach('stop', function (done) {
            done();
        });

        it('successfully resolves a dependency tree', function (done) {

            var container = new Container();

            container.register('Bob', Dependency1);
            container.register('Mary', Dependency2);
            container.register('Joe', Obj1, ['Bob', 'Mary']);   // 'Joe' depends on 'Bob' and 'Mary'

            var obj1 = container.resolve('Joe');

            obj1.testMethod(function (err, result) {
                expect(result).to.equal('success');
                done();
            });
        });

        it('successfully resolves a static object', function (done) {
            var container = new Container();

            container.register('Milo', Dependency3);
            container.register('Mask', Obj2, ['Milo']); // 'Mask' depends on 'Milo'

            var obj2 = container.resolve('Mask');
            var result = obj2.testMethod();

            expect(result).to.equal('success');

            done();
        });

        it('successfully resolves a number primitive', function (done) {
            var container = new Container();

            container.register('Olive', 2);
            container.register('Popeye', Obj3, ['Olive']);  // 'Popeye' depends on 'Olive'

            var obj2 = container.resolve('Popeye');
            var result = obj2.testMethod();

            expect(result).to.equal(2);

            done();
        });

        it('successfully resolves a boolean primitive', function (done) {
            var container = new Container();

            container.register('Olive', true);
            container.register('Popeye', Obj3, ['Olive']);  // 'Popeye' depends on 'Olive'

            var obj2 = container.resolve('Popeye');
            var result = obj2.testMethod();

            expect(result).to.equal(true);

            done();
        });

        it('successfully resolves a string primitive', function (done) {
            var container = new Container();

            container.register('Olive', 'Squeak!');
            container.register('Popeye', Obj3, ['Olive']);  // 'Popeye' depends on 'Olive'

            var obj2 = container.resolve('Popeye');
            var result = obj2.testMethod();

            expect(result).to.equal('Squeak!');

            done();
        });
    });
});