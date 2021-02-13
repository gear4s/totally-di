/**
 * @leebow 2017/04/28.
 */

module.exports = TestObj7;

function TestObj7(dependency6) {
  this.__dependency6 = dependency6;
}

TestObj7.prototype.testMethod = function (callback) {
  this.__dependency6.testMethod(function (err, result) {
    callback(null, result);
  });
};
