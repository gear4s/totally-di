'use strict';

module.exports = Container;

function Container() {
    this.__bindings = [];
}

Container.prototype.register = function (alias, dependency, ctorArgAliases) {
    //console.log('registering -> alias: ', alias, ', dependency: ', dependency, ', ctor args: ', ctorArgAliases);
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

Container.prototype.__createInstance = function (binding) {

    var self = this;

    function Temp(args) {
        // invoke the constructor on *this*
        this.constructor.apply(this, args);
    }

    var args = [];

    if (binding.ctorArgAliases != undefined)
        args = this.__resolveDependencies(binding);

    var proto = binding.dependency.prototype;

    // subclass extends superclass
    if (proto) {
        if (!self.__prototypeIsEmptyObject(proto)) {
            Temp.prototype = Object.create(proto);
            return new Temp(args);
        } else {
            console.log(binding.dependency.call());
            console.log(args);
            return binding.dependency.call(args);
        }

    } else {
        Temp.prototype = Object.create(binding.dependency);
        return new Temp(args);
    }


};

Container.prototype.__prototypeIsEmptyObject = function (proto) {
    return Object.keys(proto).length === 0;// && proto.constructor === Object;
};

Container.prototype.__resolveDependencies = function (binding) {

    var self = this;

    var recurse = function (aliases) {
        var args = [];

        aliases.forEach((arg) => {

            var currentBinding = self.__getBinding(arg);
            var typeName = self.__getTypeName(currentBinding.dependency);

            switch (typeName) {
                case 'Object':
                    self.__injectAnonymousObjectValues(currentBinding);
                    args.push(currentBinding.dependency);
                    break;
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

Container.prototype.__getTypeName = function (obj) {

    var str = (obj.prototype ? obj.prototype.constructor : obj.constructor).toString();

    //console.log('--> ', str);

    var ctorName = str.match(/function\s(\w*)/)[1];

    var aliases = ["", "anonymous", "Anonymous"];
    return aliases.indexOf(ctorName) > -1 ? "Function" : ctorName;
};

Container.prototype.__injectAnonymousObjectValues = function (currentBinding) {

    var self = this;

    for (var key in currentBinding.dependency) {

        if (currentBinding.dependency.hasOwnProperty(key)) {

            var depTypeName = self.__getTypeName(currentBinding.dependency[key]);

            if (depTypeName == 'String' && depTypeName.length > 0) {

                var injectedAliasIndex = currentBinding.dependency[key].indexOf('@inject:');

                if (injectedAliasIndex > -1) {
                    var injectedAlias = currentBinding.dependency[key].substr(injectedAliasIndex + 8);
                    var injectedBinding = self.__getBinding(injectedAlias);
                    currentBinding.dependency[key] = self.__createInstance(injectedBinding);
                }
            }
        }
    }
};