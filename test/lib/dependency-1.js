module.exports = Dependency1;

function Dependency1() {
}

Dependency1.prototype.testMethod = function (callback) {

    setTimeout(function(){
        console.log('--> Dependency1.testMethod CALLED');
        callback();
    }, 2000);

};