# di-namic
Simple dependency injection container for Node

## Why?

To facilitate better architecture and testing of modules, by decoupling dependencies via the Inversion of Control pattern.

## Some background reading for the uninitiated

- https://martinfowler.com/bliki/InversionOfControl.html (old but still very relevant)
- https://martinfowler.com/articles/dipInTheWild.html
- http://www.devtrends.co.uk/blog/how-not-to-do-dependency-injection-the-static-or-singleton-container
- https://en.wikipedia.org/wiki/SOLID

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
