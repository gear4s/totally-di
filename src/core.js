export default class Core {
  #bindings = [];
  #singletons = {};

  get bindingLen() {
    return this.#bindings.length;
  }

  addBinding(binding) {
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
        if (Core.__prototypeIsEmptyObject(proto)) {
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

  static __prototypeIsEmptyObject(proto) {
    return Object.keys(proto).length === 0;
  }

  __resolveDependencies(binding) {
    /** @param {Array} aliases */
    const recurse = (aliases) => {
      return aliases.map((arg) => {
        const currentBinding = this.__getBinding(arg);
        const typeName = Core.__getTypeName(currentBinding.dependency);

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

  static __getTypeName(obj) {
    const str = (obj.prototype
      ? obj.prototype.constructor
      : obj.constructor
    ).toString();

    // find functions in obj
    const matched = str.match(/function\s(\w*)/);

    if (matched != null) {
      const ctorName = str.match(/function\s(\w*)/)[1];
      const aliases = ["", "anonymous", "Anonymous"];
      return aliases.indexOf(ctorName) > -1 ? "Function" : ctorName;
    }

    return null;
  }

  __injectAnonymousObjectValues(currentBinding) {
    for (const key in currentBinding.dependency) {
      if (
        Object.prototype.hasOwnProperty.call(currentBinding.dependency, key)
      ) {
        const depTypeName = Core.__getTypeName(currentBinding.dependency[key]);

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
