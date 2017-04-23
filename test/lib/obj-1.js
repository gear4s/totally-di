module.exports = TestObj1;

function TestObj1(dependency1, dependency2) {
    this.__dependency1 = dependency1;
    this.__dependency2 = dependency2;
}

TestObj1.prototype.testMethod = function (callback) {
    var self = this;

    this.__dependency1.testMethod(function (err) {
        if (err)
            return callback(err);

        if (self.__dependency2.testMethod())
            callback(null, 'success');
    });
};