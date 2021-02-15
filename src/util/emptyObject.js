/**
 * This file contains a utility function which checks
 * if an object's prototype is just an empty object
 */

export default (proto) => Object.keys(proto).length === 0;
