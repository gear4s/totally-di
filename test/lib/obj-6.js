module.exports = TestObj6;

function TestObj6() {
}

TestObj6.prototype.testMethod = function (callback) {
    callback(null, 'success');
};