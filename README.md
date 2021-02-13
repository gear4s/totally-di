[![travis](https://travis-ci.org/leebow/di-namic.svg?branch=master)](https://travis-ci.org/leebow/di-namic)
[![node](https://img.shields.io/badge/node-8.4.0-green.svg)](https://nodejs.org/en/download/releases/)
[![ecmascript 6](https://img.shields.io/badge/ecmascript-6-green.svg)](http://es6-features.org/)

# totally-di
Simple dependency injection container for Node, forked from [di-namic](https://gitlab.com/leebow/di-namic). __ECMAScript 6 only__.

## Why?

To facilitate better the design and testing of modules, by decoupling dependencies via the Inversion of Control principle. 

Simply put: ***Don't instantiate dependencies in the module!***

## Design goals

- Single 'container' where all dependencies are defined
  - code-based as opposed to configuration-based
  - each dependency has a scope:
    - none OR
    - singleton
- The container would generally be required by the top-level 'entry-point' .js file, which resolves dependencies from the container. As each of these has its own set of dependencies, a dependency graph is generated.
- Registration of dependencies to include the following types:
  - objects with a constructor (ie: an instance should be created at resolution-time)
  - static objects
  - primitive types (ie: numbers, booleans, strings)

## An example module

The following examples are of modules that have dependencies on other modules.


**Prototype-based** (not recommended (ES5 Classes); with promises)

```javascript
module.exports = TestObj1;

function TestObj1(dependency1, dependency2) {
    this.__dependency1 = dependency1;
    this.__dependency2 = dependency2;
}

TestObj1.prototype.testMethod = function () {
  const self = this;

  return new Promise((resolve, reject) => {
    self.__dependency1.testMethod()
      .then(result1 => {
        self.__dependency2.testMethod(result1)
          .then(result2 => {
            resolve(result2);
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};
```

***OR***

**Class-based** (recommended (ES6 Classes))

```javascript
module.exports = class TestObj1 {
  constructor(dependency1, dependency2) {
    this.__dependency1 = dependency1;
    this.__dependency2 = dependency2;
  }

  async testMethod() {
    try {
      const result1 = await this.__dependency1.testMethod();
      return await this.__dependency2.testMethod(result1);
    } catch (err) {
      throw err;
    }
  }
};
```

The module is therefore not responsible for creating instances of a dependency, but is instead relying on a consumer to do the instantiation for us. From a testing perspective, this approach allows dependencies to be __externally mocked__.

## Container functions

### `register`

Register a dependency. Each time `resolve` is called, a new instance of the dependency is returned.

```javascript
container.register(alias, dependency, ctorArgAliases)
```

### `registerFactory`

Register a dependency. Each time `resolve` is called, a new instance of the dependency is returned, using the dependency's own factory method.

```javascript
container.registerFactory(alias, dependency, factoryMethodName)
```

### `registerSingleton`

Register a dependency. Each time `resolve` is called, a singleton instance of the dependency is returned. The container maintains a single instance.

```javascript
container.registerSingleton(alias, dependency)
```

### `registerSingletonFactory`

Register a dependency. Each time `resolve` is called, a singleton instance of the dependency is returned. The container maintains a single instance, which is originally created by the dependency's own factory method.

```javascript
container.registerSingletonFactory(alias, dependency, factoryMethodName)
```

### `resolve`

Returns an instance of a dependency.

```javascript
container.resolve(alias)
```

### Parameters:

- __alias__:
  - (string) key to refer to the registration
- __dependency__:
  - (object|instance|primitive) the dependency itself:
- __ctorArgAliases__:
  - the constructor arguments (i.e. dependencies), referred to by the aliases they've been registered with
- **factoryMethodName**
  - the factory method that creates an instance of the dependency

## Usage

Using the framework requires an understanding of the principles of dependency injection, particularly __constructor injection__.

Javascript modules would typically rely on external dependencies introduced via the constructor function. 

When using **di-namic** in a Node application:

1. Dependencies are registered with the __di-namic__ container
2. The container must remain in scope for the lifetime of the application
3. A "dependency tree" is created at the root/entry point of the application. For example this would be root __index.js__ file of a typical Node application.
4. There are 2 main functions on the container (see "container functions" above): 
   - `register`  (with variations)
   - `resolve` 

### Example

The examples below are based on the module sample above.

    TestObj1
            ↳ Dependency1
            ↳ Dependency2

__index.js__

```javascript
const Container = require('di-namic').ContainerV2;
const Dependency1 = require('../lib/dependency1');
const Dependency2 = require('../lib/dependency2');
const TestObj1 = require('../lib/testObj1');
const app = require('../app');

module.exports = class Index {
    constructor() {
        this.__container = new Container();
    }

    //register the dependencies with the container
    async register() {
        await this.__container.register('Bob', Dependency1);
        await this.__container.register('Mary', Dependency2);

        // 'Joe' relies on 'Bob' and 'Mary' 
        await this.__container.register('Joe', TestObj1, ['Bob', 'Mary']);
    }

    async initialize() {
        await this.register();

        // resolve the dependency (including sub-dependencies)
        var testObj1 = await this.__container.resolve('Joe');

        // now start the app with dependencies injected into the constructor
        await app.start(testObj1);
    }
};
```

The above example is rather contrived - see the tests for a more comprehensive dependency tree example.

## Some background reading for the uninitiated

- https://martinfowler.com/bliki/InversionOfControl.html (old but still very relevant)
- https://martinfowler.com/articles/dipInTheWild.html
- http://www.devtrends.co.uk/blog/how-not-to-do-dependency-injection-the-static-or-singleton-container
- https://en.wikipedia.org/wiki/SOLID

## Attribution & license

Please credit the author where appropriate. License below.

**MIT License**

Copyright (c) 2017

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
