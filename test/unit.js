var expect = require('expect.js');
var path = require('path');

var Container = require('../lib/container');
var Obj1 = require('./lib/obj-1');
var Obj2 = require('./lib/obj-2');
var Obj3 = require('./lib/obj-3');
var Obj4 = require('./lib/obj-4');
var Obj5 = require('./lib/obj-5');
var Dependency1 = require('./lib/dependency-1');
var Dependency2 = require('./lib/dependency-2');
var Dependency3 = require('./lib/dependency-3');
var Dependency4 = require('./lib/dependency-4');
var Dependency5 = require('./lib/dependency-5');

describe('unit - container', function () {

    this.timeout(30000);

    context('', function () {

        beforeEach('setup', function (done) {

            done();
        });

        afterEach('stop', function (done) {
            done();
        });

        it('successfully resolves first-level dependencies', function (done) {

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

        it('successfully resolves nested dependencies', function (done) {

            var container = new Container();

            container.register('Bob', Dependency1);
            container.register('Jack', Dependency4, ['Bob']);  // 'Jack' depends on 'Bob'
            container.register('Jim', Obj4, ['Jack']);   // 'Joe' depends on 'Jack'

            var obj4 = container.resolve('Jim');

            obj4.testMethod(function (err, result) {
                expect(result).to.equal('success');
                done();
            });
        });

        it('successfully resolves anonymous object value dependencies', function (done) {

            /*
             ie: a constructor dependency is an anonymous object, which itself contains a
             key whose value is an object that we've registered...

             MyPrototype(arg1, {key1: '@inject:dependency_x'})
             */

            var container = new Container();

            container.register('Bob', Dependency1);
            container.register('Ellie', {key1: '@inject:Bob', key2: 'Blah'}); // anonymous object 'Ellie' depends on 'Bob'
            container.register('Chuck', Obj5, ['Ellie']);   // 'Jim' depends on 'Ellie'

            var obj5 = container.resolve('Chuck');

            obj5.testMethod(function (err, result) {
                expect(result).to.equal('success');
                done();
            });
        });

        it('successfully resolves anonymous object directly', function (done) {

            var container = new Container();

            container.register('Freddie', {key1: 'Hello'}); // anonymous object 'Ellie' depends on 'Bob'

            var result = container.resolve('Freddie');

            expect(result.key1).to.equal('Hello');
            done();
        });

        it('successfully resolves a static object as a dependency', function (done) {
            var container = new Container();

            container.register('Milo', Dependency3);
            container.register('Mask', Obj2, ['Milo']); // 'Mask' depends on 'Milo'

            var obj2 = container.resolve('Mask');
            var result = obj2.testMethod();

            expect(result).to.equal('success');

            done();
        });

        it('successfully resolves a static object directly', function (done) {
            var container = new Container();

            container.register('Milo', Dependency3);

            var result = container.resolve('Milo');

            expect(result.testMethod()).to.equal('success');

            done();
        });

        it('successfully resolves a static object directly 2', function (done) {
            var container = new Container();

            console.log(Dependency5);
            container.register('Marmite', Dependency5);

            var result = container.resolve('Marmite');

            expect(result.testMethod()).to.equal('success');

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