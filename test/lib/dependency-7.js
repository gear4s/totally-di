module.exports = Dependency7;

function Dependency7() {
    this.__treeCount = 0;
}

Dependency7.prototype.plantTree = function (callback) {
    this.__treeCount += 1;
    callback(null, this.__treeCount);
};