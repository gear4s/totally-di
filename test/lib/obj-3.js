module.exports = TestObj3;

function TestObj3(primitive){
    this.__primitive = primitive;
}

TestObj3.prototype.testMethod = function(){
    return this.__primitive;
};

