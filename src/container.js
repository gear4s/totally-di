import Core from "./core";

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
  }

  get bindingLen() {
    return this.#core.bindingLen;
  }

  register(alias, dependency, ctorArgAliases = []) {
    this.#core.addBinding({
      alias: alias,
      dependency: dependency,
      ctorArgAliases: ctorArgAliases,
      singleton: false,
    });
  }

  registerRawObject(alias, dependency) {
    this.#core.addBinding({
      alias: alias,
      dependency: dependency,
      rawObject: true,
    });
  }

  registerSingleton(alias, dependency, ctorArgAliases = []) {
    this.#core.addBinding({
      alias: alias,
      dependency: dependency,
      ctorArgAliases: ctorArgAliases,
      singleton: true,
    });
  }

  registerFactory(alias, dependency, factoryMethod, ctorArgAliases = []) {
    this.#core.addBinding({
      alias: alias,
      dependency: dependency,
      ctorArgAliases: ctorArgAliases,
      factoryMethod: factoryMethod,
      singleton: false,
    });
  }

  registerSingletonFactory(
    alias,
    dependency,
    factoryMethod,
    ctorArgAliases = []
  ) {
    this.#core.addBinding({
      alias: alias,
      dependency: dependency,
      ctorArgAliases: ctorArgAliases,
      factoryMethod: factoryMethod,
      singleton: true,
    });
  }

  resolve(alias) {
    return this.#core.createInstance(alias);
  }
}
