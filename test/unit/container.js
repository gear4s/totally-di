import Container from '~/src/container';
import Obj1 from '../lib/obj-1';
import Obj2 from '../lib/obj-2';
import Obj3 from '../lib/obj-3';
import Obj4 from '../lib/obj-4';
import Obj5 from '../lib/obj-5';
import Obj6 from '../lib/obj-6';
import Obj7 from '../lib/obj-7';
import Obj8 from '../lib/obj-8';
import Obj9 from '../lib/obj-9';
import Obj10 from '../lib/obj-10';
import Dependency1 from '../lib/dependency-1';
import Dependency2 from '../lib/dependency-2';
import Dependency3 from '../lib/dependency-3';
import Dependency4 from '../lib/dependency-4';
import Dependency5 from '../lib/dependency-5';
import Dependency6 from '../lib/dependency-6';
import Dependency7 from '../lib/dependency-7';
import Dependency8 from '../lib/dependency-8';
import { expect } from 'chai';

describe('unit - container v2', function () {
    this.timeout(30000);

    it('successfully resolves first-level dependencies', function (done) {
      const container = Container.getInstance();

      container.register('Bob', Dependency1);
      container.register('Mary', Dependency2);
      container.register('Joe', Obj1, ['Bob', 'Mary']);

      // 'Joe' depends on 'Bob' and 'Mary'
      const result = container.resolve('Joe');

      result.testMethod(function (err, testResult) {
        console.log(testResult);
        expect(testResult).to.equal('success');
        done();
      });
    });

    it('successfully registers and resolves when no constructor dependencies required', function (done) {
      const container = new Container();
      container.register('Joe', Obj6);

      const result = container.resolve('Joe');
      result.testMethod(function (err, testResult) {
        expect(testResult).to.equal('success');
        done();
      });
    });

    it('successfully resolves nested dependencies', function (done) {
      const container = new Container();

      container.register('Bob', Dependency1);
      // 'Jack' depends on 'Bob'
      container.register('Jack', Dependency4, ['Bob']);
      // 'Joe' depends on 'Jack'
      container.register('Jim', Obj4, ['Jack']);

      const result = container.resolve('Jim');

      result.testMethod(function (err, testResult) {
        expect(testResult).to.equal('success');
        done();
      });
    });

    it('successfully resolves anonymous object value dependencies', function (done) {
      /*
        ie: a constructor dependency is an anonymous object, which itself contains a
        key whose value is an object that we've registered...

        MyPrototype(arg1, {key1: '@inject:dependency_x'})
        */
      const container = new Container();

      container.register('Bob', Dependency1);
      // anonymous object 'Ellie' depends on 'Bob'
      container.register('Ellie', {key1: '@inject:Bob', key2: 'Blah'});
      // 'Chuck' depends on 'Ellie'
      container.register('Chuck', Obj5, ['Ellie']);

      const result = container.resolve('Chuck');

      result.testMethod(function (err, testResult) {
        expect(testResult).to.equal('success');
        done();
      });
    });

    it('successfully resolves anonymous object directly', function () {
      const container = new Container();
      container.register('Freddie', {key1: 'Hello'});
      const result = container.resolve('Freddie');
      expect(result.key1).to.equal('Hello');
    });

    it('successfully resolves a static object as a dependency', function () {
        const container = new Container();

        container.register('Milo', Dependency3);
        // 'Mask' depends on 'Milo'
        container.register('Mask', Obj2, ['Milo']);

        const result = container.resolve('Mask');
        const testResult = result.testMethod();

        expect(testResult).to.equal('success');
    });

    it('successfully resolves a static object directly', function () {
        const container = new Container();
        container.register('Milo', Dependency3);
        const result = container.resolve('Milo');
        expect(result.testMethod()).to.equal('success');
    });

    it('successfully resolves a static object directly 2', function () {
        const container = new Container();

        container.register('Toast', 'buttered');
        container.register('Marmite', Dependency5, ['Toast']);

        const result = container.resolve('Marmite');

        console.log('BINDINGS LENGTH: ', container.bindingLen);

        expect(result.testMethod()).to.equal('buttered');
    });

    it('successfully resolves a number primitive', function () {
        const container = new Container();

        container.register('Olive', 2);
        // 'Popeye' depends on 'Olive'
        container.register('Popeye', Obj3, ['Olive']);

        const result = container.resolve('Popeye');
        const testResult = result.testMethod();

        expect(testResult).to.equal(2);
    });

    it('successfully resolves a boolean primitive', function () {
        const container = new Container();

        container.register('Olive', true);
        // 'Popeye' depends on 'Olive'
        container.register('Popeye', Obj3, ['Olive']);

        const result = container.resolve('Popeye');
        const testResult = result.testMethod();

        expect(testResult).to.equal(true);
    });

    it('successfully resolves a string primitive', function () {
        const container = new Container();

        container.register('Olive', 'Squeak!');
        // 'Popeye' depends on 'Olive'
        container.register('Popeye', Obj3, ['Olive']);

        const result = container.resolve('Popeye');
        const testResult = result.testMethod();

        expect(testResult).to.equal('Squeak!');
    });

    it('successfully resolves an object instance from a factory', function (done) {
        const container = Container.getInstance();

        container.registerFactory('Gin', Dependency6, 'create');
        container.register('Tonic', Obj7, ['Gin']);

        const result = container.resolve('Tonic');

        result.testMethod(function (err, result) {
            expect(result).to.equal('Slurp!');
            done();
        });
    });

    it('successfully resolves a singleton object instance', function (done) {
        const container = Container.getInstance();

        container.registerSingleton('Mega', Obj8);

        const mega = container.resolve('Mega');

        mega.testMethod(1, function (err, result) {
            expect(result).to.equal(1);

            const mega2 = container.resolve('Mega');
            mega2.testMethod(5, function (err, result) {
                expect(result).to.equal(6);
                done();
            });
        });
    });

    it('successfully resolves a singleton object dependency', function (done) {
        const container = Container.getInstance();

        container.registerSingleton('Mighty', Dependency7);
        container.register('Mouse', Obj8, ['Mighty']);

        const mouse = container.resolve('Mouse')

        mouse.testMethod2(function (err, result) {
            expect(result).to.equal(1);

            const mouse2 = container.resolve('Mouse');
            mouse2.testMethod2(function (err, result) {
                expect(result).to.equal(2);
                done();
            });
        });
    });

    it('successfully resolves a raw object dependency', function () {
        const container = Container.getInstance();

        container.registerRawObject('Mighty', Dependency8);

        const mighty = container.resolve('Mighty');
        expect(mighty).to.not.have.property("failed");
    });

    it('successfully resolves a singleton factory object dependency', function (done) {
        const container = Container.getInstance();

        container.registerSingletonFactory('Donald', Obj9, 'create');

        const donald = container.resolve('Donald');
        donald.testMethod(5, function (err, result) {
            expect(result).to.equal(5);

            const donald2 = container.resolve('Donald');
            donald2.testMethod(11, function (err, result) {
                expect(result).to.equal(16);
                done();
            });
        });
    });
});
