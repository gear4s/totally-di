import Core from './core';

export default class Container {
  /**
   * @type {Core}
   */
  #core = void 0;

  constructor() {
    this.#core = new Core();
  }

  /**
   * Get a new Container instance
   * @returns {Container}
   */
  static getInstance() {
    return new Container();
  };

  /**
   * Get the amount of dependency bindings currently registered
   * @returns {Number}
   */
  get bindingLen() {
    return this.#core.bindingLen;
  }

  /***
   * Register a new dependency as a normal class
   * @param alias The string alias representing the type
   * @param dependency The type itself (eg: Widget.prototype)
   * @param ctorArgAliases Constructor argument array of type aliases
   * @returns void
   */
  register(alias, dependency, ctorArgAliases = []) {
    try {
      this.#core.addBinding({
        alias: alias,
        dependency: dependency,
        ctorArgAliases: ctorArgAliases,
        singleton: false
      });
    } catch (err) {
      throw err;
    }
  };

  /***
   * Register a new dependency as a singleton class
   * @param alias The string alias representing the type
   * @param dependency The type itself (eg: Widget.prototype)
   * @param ctorArgAliases Constructor argument array of type aliases
   * @returns void
   */
  registerSingleton(alias, dependency, ctorArgAliases = []) {
    try {
      this.#core.addBinding({
        alias: alias,
        dependency: dependency,
        ctorArgAliases: ctorArgAliases,
        singleton: true
      });
    } catch (err) {
      throw err;
    }
  };

  /***
   * Register a new dependency as a normal class with a factory method
   * @param alias The string alias representing the type
   * @param dependency The type itself (eg: Widget.prototype)
   * @param factoryMethod The factory method used to create the instance
   * @param ctorArgAliases Constructor argument array of type aliases
   * @returns void
   */
  registerFactory(alias, dependency, factoryMethod, ctorArgAliases = []) {
    try {
      this.#core.addBinding({
        alias: alias,
        dependency: dependency,
        ctorArgAliases: ctorArgAliases,
        factoryMethod: factoryMethod,
        singleton: false
      });
    } catch (err) {
      throw err;
    }
  };

  /***
   * Register a new dependency as a singleton class with a factory method
   * @param alias The string alias representing the type
   * @param dependency The type itself (eg: Widget.prototype)
   * @param factoryMethod The factory method used to create the instance
   * @param ctorArgAliases Constructor argument array of type aliases
   * @returns void
   */
  registerSingletonFactory(alias, dependency, factoryMethod, ctorArgAliases = []) {
    try {
      this.#core.addBinding({
        alias: alias,
        dependency: dependency,
        ctorArgAliases: ctorArgAliases,
        factoryMethod: factoryMethod,
        singleton: true
      });
    } catch (err) {
      throw err;
    }
  };

  /***
   * Resolve a dependency by its alias which was registered
   * @param alias
   * @returns dependency instance
   */
  resolve(alias) {
    try {
      return this.#core.createInstance(alias);
    } catch (err) {
      throw err;
    }
  };
};
