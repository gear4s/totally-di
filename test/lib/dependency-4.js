/**
 * @leebow 2017/04/28.
 */

module.exports = Dependency4;

function Dependency4(dependency1) {
    this.__dependency1 = dependency1;
}

Dependency4.prototype.testMethod = function (callback) {

    var self = this;

    self.__dependency1.testMethod(function(err, result){
        callback(null, result);
    });
};