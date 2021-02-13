module.exports = TestObj2;

function TestObj2(dependency3) {
  this.__dependency3 = dependency3;
}

TestObj2.prototype.testMethod = function () {
  return this.__dependency3.testMethod();
};
