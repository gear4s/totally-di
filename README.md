[![travis](https://travis-ci.org/leebow/di-namic.svg?branch=master)](https://travis-ci.org/leebow/di-namic)

# di-namic
Simple dependency injection container for Node

## Why?

To facilitate better the design and testing of modules, by decoupling dependencies via the Inversion of Control principle. Simply put:

***Don't instantiate dependencies in the module!***


## Usage

Using the framework requires an understanding of the principles of dependency injection, particularly __constructor injection__.

Javascript modules would typically rely on external dependencies introduced via the constructor function. For example:

```javascript
module.exports = TestObj1;

function TestObj1(dependency1, dependency2) {
    this.__dependency1 = dependency1;
    this.__dependency2 = dependency2;
}

TestObj1.prototype.testMethod = function (callback) {
    var self = this;

    this.__dependency1.testMethod(function (err) {
        if (err)
            return callback(err);

        if (self.__dependency2.testMethod())
            callback(null, 'success');
    });
};
```

The module is therefore not responsible for creating instances of a dependency, but is instead relying on a consumer to do the instantiation for us. From a testing perspective, this approach allows dependencies to be __externally mocked__.

When using di-namic in a Node application:

1. Dependencies are registered with the __di-namic__ container

2. The container must remain in scope for the lifetime of the application

3. A "dependency tree" is created at the root/entry point of the application. For example this would be root __index.js__ file of a typical Node application.

4. There are 2 main functions on the container, with the following signatures:
    ```javascript
    register(alias, dependency, ctorArgAliases, callback)
    ```

    where:

    - __alias__:
        - (string) key to refer to the registration
    - __dependency__ - the dependency itself, which can be any of the following types:
        - module
        - anonymous object
        - static object
        - primitive (string, integer, boolean)
    - __ctorArgAliases__ - the constructor arguments, referred to by their aliases
    - __callback__ - this is an async function, so this is the callback
        ​

    ```javascript
    resolve(alias, callback) 
    ```

    where:

    - __alias__ - the key used when registering the dependency
    - __callback__ - this is an async function, so this is the callback

## Example

    TestObj1
            ↳ Dependency1
            ↳ Dependency2

__index.js__

```javascript

var Container = require('di-namic');
var Dependency1 = require('../lib/dependency1');
var Dependency2 = require('../lib/dependency2');
var app = require('../app');

var container = new Container();

/*
 register the dependencies with the container
*/
var register = function(callback){

    container.register('Bob', Dependency1, function (err) {

        if(err)
            return callback(err);

        container.register('Mary', Dependency2, function (err) {

            if(err)
                return callback(err);

            // 'Joe' relies on 'Bob' and 'Mary'
            container.register('Joe', TestObj1, ['Bob', 'Mary'], function (err) {

                    if(err)
                        return callback(err);

                    callback();
                });
            });
        });
}

/*
 register the dependencies and then immediately resolve them
*/
register(function(err){

    if(err)
        throw err;

    container.resolve('Bob', function(err, dependency1){

        if(err)
                throw err;

        container.resolve('Mary', function(err, dependency2){

            if(err)
                    throw err;

            // now start the app with dependencies injected into the constructor
            app.start(dependency1, dependency2);
        })
    })
})
```

The above example is rather contrived - see the tests for a more comprehensive dependency tree example.

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
