module.exports = Container;

function Container() {
    this.__bindings = [];
}

Container.prototype.register = function (alias, type, ctorArgAliases) {
    console.log('registering -> alias: ', alias, ', type: ', type, ', ctor args: ', ctorArgAliases);
    this.__bindings.push({alias: alias, type: type, ctorArgAliases: ctorArgAliases});
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

            var constructorName = self.__getConstructorName(currentBinding.type);

            switch (constructorName) {
                case 'Object':
                case 'Number':
                case 'String':
                case 'Boolean':
                    args.push(currentBinding.type);
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
    Temp.prototype = Object.create(binding.type.prototype);

    // get the dependencies
    var args = [];

    if (binding.ctorArgAliases != undefined)
        args = this.__resolveDependencies(binding);

    // create the instance JIT
    return new Temp(args);
};

Container.prototype.__getConstructorName = function (obj) {
    var str = (obj.prototype ? obj.prototype.constructor : obj.constructor).toString();
    var ctxName = str.match(/function\s(\w*)/)[1];
    var aliases = ["", "anonymous", "Anonymous"];
    return aliases.indexOf(ctxName) > -1 ? "Function" : ctxName;
};