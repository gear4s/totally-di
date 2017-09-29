/**
 * @leebow 2017/04/28.
 */

module.exports = TestObj8;

function TestObj8(dependency7) {
    this.__counter = 0;
    this.__dependency7 = dependency7;
}

TestObj8.prototype.testMethod = function (count, callback) {

    this.__counter += count;
    callback(null, this.__counter);
};

TestObj8.prototype.testMethod2 = function (callback) {

    this.__dependency7.plantTree(function(err, result){
        callback(null, result);
    });
};

