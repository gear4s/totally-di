import isEmptyObject from "./util/emptyObject";
import getTypeName from "./util/typeName";

export default class Core {
  #bindings = [];
  #singletons = {};

  get bindingLen() {
    return this.#bindings.length;
  }

  addBinding(binding) {
    if (typeof binding.alias !== "string") {
      throw new Error(
        "Failed to register dependency: 'alias' required as a string"
      );
    }

    try {
      isEmptyObject(binding.dependency);
    } catch (e) {
      throw new TypeError(
        "Failed to register dependency: 'dependency' required to be defined as an object-like type"
      );
    }

    if (!binding.rawObject && !Array.isArray(binding.ctorArgAliases)) {
      throw new Error(
        "Failed to register dependency: 'ctorArgAliases' required to be an array"
      );
    }

    if (binding.factory) {
      if (typeof binding.factoryMethod !== "string") {
        throw new Error(
          "Failed to register dependency: 'factoryMethod'  required to be the name of a factory function when registering factories"
        );
      }

      if (typeof binding.dependency[binding.factoryMethod] !== "function") {
        throw new Error(
          "Failed to register dependency: 'factoryMethod' is not a valid method within the dependency"
        );
      }
    }

    this.#bindings.push(binding);
  }

  createInstance(alias) {
    const binding = this.__getBinding(alias);
    const isSingleton = binding.singleton;
    const isRawObject = binding.rawObject;
    const dependency = binding.dependency;
    const proto = dependency.prototype;
    const factoryMethod = dependency[binding.factoryMethod];

    // just return a stored singleton if exists
    if (isSingleton && this.#singletons[alias] != null)
      return this.#singletons[alias];

    const args = [];

    if (binding.ctorArgAliases !== undefined)
      args.push(...this.__resolveDependencies(binding));

    // if this is a raw object, just return it
    if (isRawObject === true) {
      return binding.dependency;
    }

    // if this is a factory method, just invoke it and return
    if (factoryMethod != null) {
      const result = factoryMethod(...args); // use the spread operator

      if (isSingleton) this.#singletons[binding.alias] = result;

      return result;
    }

    function Temp(args) {
      // invoke the constructor on *this*
      this.constructor(...args);
    }

    // IIFE to get instance
    const instance = (() => {
      // subclass extends superclass
      if (proto) {
        if (isEmptyObject(proto)) {
          // static object
          return new dependency(...args);
        } else {
          // inherit the prototype
          Temp.prototype = Object.create(proto);
        }
      } else {
        // no prototype
        Temp.prototype = Object.create(dependency);
      }

      return new Temp(args);
    })();

    if (isSingleton) this.#singletons[binding.alias] = instance;

    return instance;
  }

  __getBinding(alias) {
    return this.#bindings.find((binding) => binding.alias === alias);
  }

  __resolveDependencies(binding) {
    /** @param {Array} aliases */
    const recurse = (aliases) => {
      return aliases.map((arg) => {
        const currentBinding = this.__getBinding(arg);
        const typeName = getTypeName(currentBinding.dependency);

        if (arg.ctorArgAliases !== undefined && arg.ctorArgAliases.length > 0) {
          // recurse the alias's constructor arguments on next event loop tick
          setImmediate(() => {
            recurse(arg.ctorArgAliases);
          });
        }

        switch (typeName) {
          case "Object":
            if (currentBinding.factoryMethod != null)
              return this.createInstance(arg);
            else if (currentBinding.rawObject) {
              return currentBinding.dependency;
            } else {
              this.__injectAnonymousObjectValues(currentBinding);
              return currentBinding.dependency;
            }
          case "Number":
          case "String":
          case "Boolean":
            return currentBinding.dependency;
          default:
            return this.createInstance(arg);
        }
      });
    };

    return recurse(binding.ctorArgAliases);
  }

  __injectAnonymousObjectValues(currentBinding) {
    for (const key in currentBinding.dependency) {
      if (
        Object.prototype.hasOwnProperty.call(currentBinding.dependency, key)
      ) {
        const depTypeName = getTypeName(currentBinding.dependency[key]);

        if (depTypeName === "String" && depTypeName.length > 0) {
          const injectedAliasIndex = currentBinding.dependency[key].indexOf(
            "@inject:"
          );

          if (injectedAliasIndex > -1) {
            const injectedAlias = currentBinding.dependency[key].substr(
              injectedAliasIndex + 8
            );
            currentBinding.dependency[key] = this.createInstance(injectedAlias);
          }
        }
      }
    }
  }
}
