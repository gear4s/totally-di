import Container from "totally-di";

declare module "totally-di" {
  export class Container {
    /**
     * Get a new Container instance
     */
    static getInstance(): Container

    /**
     * Get the amount of dependency bindings currently registered
     */
    get bindingLen(): Number

    /***
     * Register a new dependency as a normal class
     * @param alias The string alias representing the type
     * @param dependency The type itself (eg: Widget.prototype)
     * @param ctorArgAliases Constructor argument array of type aliases
     * @returns void
     */
    register(alias: String, dependency: any, ctorArgAliases: Array = []): void

    /***
     * Register a new dependency as a singleton class
     * @param alias The string alias representing the type
     * @param dependency The type itself (eg: Widget.prototype)
     * @param ctorArgAliases Constructor argument array of type aliases
     */
    registerSingleton(alias: String, dependency: any, ctorArgAliases: Array = []): void

    /***
     * Register a new dependency as a normal class with a factory method
     * @param alias The string alias representing the type
     * @param dependency The type itself (eg: Widget.prototype)
     * @param factoryMethod The factory method used to create the instance
     * @param ctorArgAliases Constructor argument array of type aliases
     */
    registerFactory(alias: String, dependency: any, factoryMethod: String, ctorArgAliases: Array = []): void

    /***
     * Register a new dependency as a singleton class with a factory method
     * @param alias The alias representing the type
     * @param dependency The type itself (eg: Widget.prototype)
     * @param factoryMethod The factory method used to create the instance
     * @param ctorArgAliases Constructor argument array of type aliases
     */
    registerSingletonFactory(alias: String, dependency: any, factoryMethod: String, ctorArgAliases: Array = []): void

    /***
     * Resolve a dependency by its alias which was registered
     */
    resolve(alias: String): any
  };
}
