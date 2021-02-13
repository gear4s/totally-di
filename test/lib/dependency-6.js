module.exports = Dependency6;

function Dependency6() {}

Dependency6.prototype.testMethod = function (callback) {
  callback(null, "Slurp!");
};

Dependency6.create = function () {
  return new Dependency6();
};
