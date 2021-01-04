import Core from './core';

export default class Container {
  /**
   * @type {Core}
   */
  #core = void 0;

  constructor() {
    this.#core = new Core();
  }

  static getInstance() {
    return new Container();
  };

  get bindingLen() {
    return this.#core.bindingLen;
  }

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

  registerRawObject(alias, dependency) {
    try {
      this.#core.addBinding({
        alias: alias,
        dependency: dependency,
        rawObject: true
      });
    } catch (err) {
      throw err;
    }
  };

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

  resolve(alias) {
    try {
      return this.#core.createInstance(alias);
    } catch (err) {
      throw err;
    }
  };
};
