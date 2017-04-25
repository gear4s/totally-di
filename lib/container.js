'use strict';

module.exports = Container;

function Container() {
    this.__bindings = [];
}

Container.prototype.register = function (alias, dependency, ctorArgAliases) {
    console.log('registering -> alias: ', alias, ', dependency: ', dependency, ', ctor args: ', ctorArgAliases);
    this.__bindings.push({alias: alias, dependency: dependency, ctorArgAliases: ctorArgAliases});
};

Container.prototype.resolve = function (alias) {
    var binding = this.__getBinding(alias);
    return this.__createInstance(binding);
};

Container.prototype.__getBinding = function (alias) {
    return this.__bindings.filter((binding) => {
        return binding.alias == alias;
    })[0];
};

Container.prototype.__resolveDependencies = function (binding) {

    var self = this;

    var recurse = function (aliases) {
        var args = [];

        aliases.forEach((arg) => {

            var currentBinding = self.__getBinding(arg);
            var constructorName = self.__getConstructorName(currentBinding.dependency);

            switch (constructorName) {
                case 'Object':
                case 'Number':
                case 'String':
                case 'Boolean':
                    args.push(currentBinding.dependency);
                    break;
                default:
                    args.push(self.__createInstance(currentBinding));
            }

            if (arg.ctorArgAliases != undefined && arg.ctorArgAliases.length > 0)
                return recurse(arg.ctorArgAliases);
        });

        return args;
    };

    return recurse(binding.ctorArgAliases);
};

Container.prototype.__createInstance = function (binding) {

    function Temp(args) {
        // invoke the constructor on *this*
        this.constructor.apply(this, args);
    }

    // subclass extends superclass
    Temp.prototype = Object.create(binding.dependency.prototype);

    var args = [];

    if (binding.ctorArgAliases != undefined)
        args = this.__resolveDependencies(binding);

    return new Temp(args);
};

Container.prototype.__getConstructorName = function (obj) {

    var str = (obj.prototype ? obj.prototype.constructor : obj.constructor).toString();
    var ctorName = str.match(/function\s(\w*)/)[1];

    var aliases = ["", "anonymous", "Anonymous"];
    return aliases.indexOf(ctorName) > -1 ? "Function" : ctorName;
};