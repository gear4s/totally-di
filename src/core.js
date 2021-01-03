export default class Core {
  #bindings = []
  #singletons = {}

  get bindingLen() {
    return this.#bindings.length;
  }

  addBinding(binding) {
    this.#bindings.push(binding);
  }

  createInstance(alias) {
    const binding = this.__getBinding(alias);
    const isSingleton = binding.singleton;
    const dependency = binding.dependency;
    const proto = dependency.prototype;
    const factoryMethod = dependency[binding.factoryMethod];

    // just return a stored singleton if exists
    if (isSingleton && this.#singletons[alias] != null)
      return this.#singletons[alias];

    const args = [];

    if (binding.ctorArgAliases != undefined)
      args.push(...this.__resolveDependencies(binding));

    // if this is a factory method, just invoke it and return
    if (factoryMethod != null) {
      const result = factoryMethod(... args);   // use the spread operator

      if (isSingleton)
        this.#singletons[binding.alias] = result;

      return result;
    }

    function Temp(args) {
      // invoke the constructor on *this*
      this.constructor(... args);
    }

    // subclass extends superclass
    if (proto) {
      if (Core.__prototypeIsEmptyObject(proto))   // static object
        return new dependency(... args);
      else
        Temp.prototype = Object.create(proto);  // inherit the prototype
    } else  // no prototype
      Temp.prototype = Object.create(dependency);

    const instance = new Temp(args);

    if (isSingleton)
      this.#singletons[binding.alias] = instance;

    return instance;
  };

  __getBinding(alias) {
    return this.#bindings.find(binding => binding.alias == alias);
  };

  static __prototypeIsEmptyObject(proto) {
    return Object.keys(proto).length === 0;
  }

  __resolveDependencies(binding) {
    const recurse = aliases => {
      const args = [];

      aliases.forEach((arg) => {
        const currentBinding = this.__getBinding(arg);
        const typeName = Core.__getTypeName(currentBinding.dependency);

        switch (typeName) {
          case 'Object':
            if (currentBinding.factoryMethod != null)
              args.push(this.createInstance(arg));
            else {
              this.__injectAnonymousObjectValues(currentBinding);
              args.push(currentBinding.dependency);
            }
            break;
          case 'Number':
          case 'String':
          case 'Boolean':
            args.push(currentBinding.dependency);
            break;
          default:
            args.push(this.createInstance(arg));
        }

        if (arg.ctorArgAliases != undefined && arg.ctorArgAliases.length > 0)
          return recurse(arg.ctorArgAliases);
      });

      return args;
    };

    return recurse(binding.ctorArgAliases);
  };

  static __getTypeName(obj) {
    const str = (obj.prototype ? obj.prototype.constructor : obj.constructor).toString();

    // find functions in obj
    const matched = str.match(/function\s(\w*)/);

    if (matched != null) {
      const ctorName = str.match(/function\s(\w*)/)[1];
      const aliases = ["", "anonymous", "Anonymous"];
      return aliases.indexOf(ctorName) > -1 ? "Function" : ctorName;
    }

    return null;
  };

  __injectAnonymousObjectValues(currentBinding) {
    for (const key in currentBinding.dependency) {
      if (currentBinding.dependency.hasOwnProperty(key)) {
        const depTypeName = Core.__getTypeName(currentBinding.dependency[key]);

        if (depTypeName == 'String' && depTypeName.length > 0) {
          const injectedAliasIndex = currentBinding.dependency[key].indexOf('@inject:');

          if (injectedAliasIndex > -1) {
            const injectedAlias = currentBinding.dependency[key].substr(injectedAliasIndex + 8);
            currentBinding.dependency[key] = this.createInstance(injectedAlias);
          }
        }
      }
    }
  }
};
