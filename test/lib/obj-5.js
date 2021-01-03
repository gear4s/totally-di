/**
 * @leebow 2017/04/28.
 */

module.exports = TestObj5;

function TestObj5(anonymousObj) {
    this.__anonymousObj = anonymousObj;
}

TestObj5.prototype.testMethod = function (callback) {
    // invoke the testMethod on the object returned when accessing the value at key1
    this.__anonymousObj.key1.testMethod(function (err, result) {
        callback(null, result);
    });
};

