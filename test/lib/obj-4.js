/**
 * @leebow 2017/04/28.
 */

module.exports = TestObj4;

function TestObj4(dependency4) {
  this.__dependency4 = dependency4;
}

TestObj4.prototype.testMethod = function (callback) {
  this.__dependency4.testMethod(function (err, result) {
    callback(null, result);
  });
};
