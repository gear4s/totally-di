module.exports = Container;

function Container() {
    this.__bindings = [];
}

Container.prototype.bind = function (alias, proto, dependencies) {
    this.__bindings.push({name: alias, proto: proto, deps: dependencies});
};

Container.prototype.resolve = function (alias) {

    var binding = this.__getBinding(alias);
    return this.__createInstance(binding);
};

Container.prototype.__getBinding = function (alias) {
    return this.__bindings.filter((binding) => {
        return binding.name == alias;
    })[0];
};

Container.prototype.__resolveDependencies = function(binding){

    var self = this;

    var recurse = function (argList) {
        var args = [];

        console.log(argList);

        argList.forEach((arg) => {
            var currentBinding = self.__getBinding(arg.name);
            args.push(self.__createInstance(currentBinding));

            if(arg.deps != null && arg.deps.length > 0)
                return recurse(arg.deps);
        });

        return args;
    };

    return recurse(binding.deps);
};

Container.prototype.__createInstance = function (binding) {

    function Temp(args) {
        // invoke the constructor on *this*
        this.constructor.apply(this, args);
    }

    // subclass extends superclass
    Temp.prototype = Object.create(binding.proto.prototype);

    // get the dependencies
    var args = [];

    if(binding.deps != null)
        args = this.__resolveDependencies(binding);

    // create the instance JIT
    return new Temp(args);
};