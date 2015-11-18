
function Injector() {
    this.resolver = {};
}

Injector.prototype.get = function (name) {
    var _this = this;
    var resolved = this.resolver[name];
    if (!resolved) {
        throw 'injector: {name} was requested, but does not exist.'.replace('{name}', name);
    }
    if (resolved.instance) {
        return resolved.instance;
    }

    var dependencies = _.reduce(resolved.dependencies, function (p, c) {
        p[c] = _this.get(c);
        return p;
    }, {});
    var instance = resolved.factory(dependencies);
    resolved.instance = instance;
    return instance;
};

Injector.prototype.factory = function (name, dependencies, factory) {
    var resolved = this.resolver[name];
    if (!!resolved) {
        throw 'injector: {name} was already created'.replace('{name}', name);
    }
    var service = {
        name: name,
        dependencies: dependencies,
        factory: factory
    };
    this.resolver[name] = service;
};

exports.Injector = Injector;
