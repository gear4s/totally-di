# di-namic
Simple dependency injection container for Node

## Why?

- To inject constructor dependencies without the need to decorate modules with annotations
- To enable easier testing and design of modules

## Some background reading for the uninitiated

- https://en.wikipedia.org/wiki/SOLID
- https://martinfowler.com/articles/dipInTheWild.html

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

