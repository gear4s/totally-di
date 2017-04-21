module.exports = TestObj;

function TestObj(dependency1, dependency2) {
    this.__dependency1 = dependency1;
    this.__dependency2 = dependency2;
}

TestObj.prototype.testMethod = function (callback) {
    console.log('--> INSIDE TestObj.TestMethod');

    this.__dependency1.testMethod(function (err, result) {
        console.log('--> CALLBACK INVOKED!');
        callback();
    });

    this.__dependency2.testMethod();
};