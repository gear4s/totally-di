export default class {
  #dependency8 = void 0;

  constructor(dependency8) {
    this.#dependency8 = dependency8;
  }

  testMethod(callback) {
      this.#dependency8.testFunction(function(err, result){
          callback(null, result);
      });
  };
}
