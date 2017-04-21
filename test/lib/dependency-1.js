module.exports = Dependency1;

function Dependency1() {
}

Dependency1.prototype.testMethod = function (callback) {

    setTimeout(function () {
        callback();
    }, 2000);
};