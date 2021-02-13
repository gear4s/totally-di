/**
 * @leebow 2017/04/28.
 */

module.exports = TestObj9;

function TestObj9() {
  this.__counter = 0;
}

// factory
TestObj9.create = function () {
  return new TestObj9();
};

TestObj9.prototype.testMethod = function (count, callback) {
  this.__counter += count;
  callback(null, this.__counter);
};
