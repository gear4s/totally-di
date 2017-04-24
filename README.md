# di-namic
Simple dependency injection container for Node

## Why?

To facilitate better architecture and testing of modules, by decoupling dependencies via the Inversion of Control pattern.

## Some background reading for the uninitiated

- https://en.wikipedia.org/wiki/SOLID
- https://martinfowler.com/articles/dipInTheWild.html
- http://www.devtrends.co.uk/blog/how-not-to-do-dependency-injection-the-static-or-singleton-container

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
