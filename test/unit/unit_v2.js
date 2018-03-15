var expect = require('expect.js');
var path = require('path');

var Container = require('../../lib/containerV2');
var Obj1 = require('../lib/obj-1');
var Obj2 = require('../lib/obj-2');
var Obj3 = require('../lib/obj-3');
var Obj4 = require('../lib/obj-4');
var Obj5 = require('../lib/obj-5');
var Obj6 = require('../lib/obj-6');
var Obj7 = require('../lib/obj-7');
var Obj8 = require('../lib/obj-8');
var Obj9 = require('../lib/obj-9');
var Dependency1 = require('../lib/dependency-1');
var Dependency2 = require('../lib/dependency-2');
var Dependency3 = require('../lib/dependency-3');
var Dependency4 = require('../lib/dependency-4');
var Dependency5 = require('../lib/dependency-5');
var Dependency6 = require('../lib/dependency-6');
var Dependency7 = require('../lib/dependency-7');

describe('unit - container v2', function () {

    this.timeout(30000);

    context('', function () {

        beforeEach('setup', function (done) {

            done();
        });

        afterEach('stop', function (done) {
            done();
        });

        it('successfully resolves first-level dependencies', async function () {

            var container = Container.getInstance();

            await container.register('Bob', Dependency1);
            await container.register('Mary', Dependency2);
            await container.register('Joe', Obj1, ['Bob', 'Mary']);

            // 'Joe' depends on 'Bob' and 'Mary'
            var result = await container.resolve('Joe');

            result.testMethod(function (err, testResult) {
                console.log(testResult);
                expect(testResult).to.equal('success');
            });
        });

        it('successfully registers and resolves when no constructor dependencies required', async function () {

            var container = new Container();

            await container.register('Joe', Obj6);

            var result = await container.resolve('Joe');

            result.testMethod(function (err, testResult) {
                expect(testResult).to.equal('success');
            });
        });

        it('successfully resolves nested dependencies', async function () {

            var container = new Container();

            await container.register('Bob', Dependency1);
            // 'Jack' depends on 'Bob'
            await container.register('Jack', Dependency4, ['Bob']);
            // 'Joe' depends on 'Jack'
            await container.register('Jim', Obj4, ['Jack']);

            var result = await container.resolve('Jim');

            result.testMethod(function (err, testResult) {
                expect(testResult).to.equal('success');
            });
        });

        it('successfully resolves anonymous object value dependencies', async function () {

            /*
             ie: a constructor dependency is an anonymous object, which itself contains a
             key whose value is an object that we've registered...

             MyPrototype(arg1, {key1: '@inject:dependency_x'})
             */

            var container = new Container();

            await container.register('Bob', Dependency1);
            // anonymous object 'Ellie' depends on 'Bob'
            await container.register('Ellie', {key1: '@inject:Bob', key2: 'Blah'});
            // 'Chuck' depends on 'Ellie'
            await container.register('Chuck', Obj5, ['Ellie']);

            var result = await container.resolve('Chuck');

            result.testMethod(function (err, testResult) {
                expect(testResult).to.equal('success');
            });

        });

        it('successfully resolves anonymous object directly', async function () {

            var container = new Container();

            await container.register('Freddie', {key1: 'Hello'});

            var result = await container.resolve('Freddie');

            expect(result.key1).to.equal('Hello');
        });

        it('successfully resolves a static object as a dependency', async function () {

            var container = new Container();

            await container.register('Milo', Dependency3);
            // 'Mask' depends on 'Milo'
            await container.register('Mask', Obj2, ['Milo']);

            var result = await container.resolve('Mask');
            var testResult = result.testMethod();

            expect(testResult).to.equal('success');
        });

        it('successfully resolves a static object directly', async function () {

            var container = new Container();

            await container.register('Milo', Dependency3);

            var result = await container.resolve('Milo');

            expect(result.testMethod()).to.equal('success');
        });

        it('successfully resolves a static object directly 2', async function () {
            var container = new Container();

            await container.register('Toast', 'buttered');
            await container.register('Marmite', Dependency5, ['Toast']);

            var result = await container.resolve('Marmite');

            console.log('BINDINGS LENGTH: ', container.bindingLen);

            expect(result.testMethod()).to.equal('buttered');
        });

        it('successfully resolves a number primitive', async function () {
            var container = new Container();

            await container.register('Olive', 2);
            // 'Popeye' depends on 'Olive'
            await container.register('Popeye', Obj3, ['Olive']);

            var result = await container.resolve('Popeye');

            var testResult = result.testMethod();

            expect(testResult).to.equal(2);
        });

        it('successfully resolves a boolean primitive', async function () {
            var container = new Container();

            await container.register('Olive', true);
            // 'Popeye' depends on 'Olive'
            await container.register('Popeye', Obj3, ['Olive']);

            var result = await container.resolve('Popeye');

            var testResult = result.testMethod();

            expect(testResult).to.equal(true);
        });

        it('successfully resolves a string primitive', async function () {
            var container = new Container();

            await container.register('Olive', 'Squeak!');
            // 'Popeye' depends on 'Olive'
            await container.register('Popeye', Obj3, ['Olive']);

            var result = await container.resolve('Popeye');

            var testResult = result.testMethod();

            expect(testResult).to.equal('Squeak!');
        });

        it('successfully resolves an object instance from a factory', async function () {

            var container = Container.getInstance();

            await container.registerFactory('Gin', Dependency6, 'create');
            await container.register('Tonic', Obj7, ['Gin']);

            var result = await container.resolve('Tonic');

            result.testMethod(function (err, result) {

                expect(result).to.equal('Slurp!');
            });
        });

        it('successfully resolves a singleton object instance', async function () {

            var container = Container.getInstance();

            await container.registerSingleton('Mega', Obj8);

            var mega = await container.resolve('Mega');

            mega.testMethod(1, async function (err, result) {

                expect(result).to.equal(1);

                var mega2 = await container.resolve('Mega');

                mega2.testMethod(5, function (err, result) {
                    expect(result).to.equal(6);
                });
            });
        });

        it('successfully resolves a singleton object dependency', async function () {

            var container = Container.getInstance();

            await container.registerSingleton('Mighty', Dependency7);
            await container.register('Mouse', Obj8, ['Mighty']);

            var mouse = await container.resolve('Mouse')

            mouse.testMethod2(async function (err, result) {

                expect(result).to.equal(1);

                var mouse2 = await container.resolve('Mouse');

                mouse2.testMethod2(function (err, result) {

                    expect(result).to.equal(2);
                });
            });
        });

        it('successfully resolves a singleton factory object dependency', async function () {

            var container = Container.getInstance();

            await container.registerSingletonFactory('Donald', Obj9, 'create');

            var donald = await container.resolve('Donald');

            donald.testMethod(5, async function (err, result) {

                expect(result).to.equal(5);

                var donald2 = await container.resolve('Donald');

                donald2.testMethod(11, function (err, result) {
                    expect(result).to.equal(16);
                });
            });
        });
    });
});
