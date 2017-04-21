# di-namic
Simple dependency injection container for Node

## Why?

- Frustration with the many non-SOLID architectural approaches to javascript application development, particularly in the Node context
- Large codebases using a loose, dynamic style become incredibly difficult to understand and test

So I decided to create my own DI framework to do things the way I want them to be done, and possibly shine a light for others along the way. For those following Agile principles (TDD, BDD), dependency injection should be a familiar concept.

## Some background reading for the uninitiated

- https://en.wikipedia.org/wiki/SOLID
- https://martinfowler.com/articles/dipInTheWild.html



## Design

- Single 'container' where all dependencies are defined
  - code-based as opposed to configuration-based
  - each dependency has a scope:
    - none OR
    - singleton
- The container would generally be required by the top-level 'entry-point' .js file, which resolves dependencies from the container. As each of these has its own set of dependencies, the whole chain of 


