module.exports = Container;

function Container() {
    this.__bindings = [];
}

Container.prototype.register = function (alias, type, ctxArgAliases) {
    this.__bindings.push({alias: alias, type: type, ctxArgAliases: ctxArgAliases});
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
            args.push(self.__createInstance(currentBinding));

            if (arg.ctxArgAliases != undefined && arg.ctxArgAliases.length > 0)
                return recurse(arg.ctxArgAliases);
        });

        return args;
    };

    return recurse(binding.ctxArgAliases);
};

Container.prototype.__createInstance = function (binding) {

    function Temp(args) {
        // invoke the constructor on *this*
        this.constructor.apply(this, args);
    }

    // subclass extends superclass
    Temp.prototype = Object.create(binding.type.prototype);

    // get the dependencies
    var args = [];

    if (binding.ctxArgAliases != undefined)
        args = this.__resolveDependencies(binding);

    // create the instance JIT
    return new Temp(args);
};