module.exports = TestObj;

function TestObj(dependency1, dependency2) {
    this.__dependency1 = dependency1;
    this.__dependency2 = dependency2;
}

TestObj.prototype.testMethod = function (callback) {
    var self = this;

    this.__dependency1.testMethod(function (err) {
        if(err)
            return callback(err);

        if (self.__dependency2.testMethod())
            callback(null, 'success');
    });
};