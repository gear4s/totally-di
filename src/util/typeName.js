/**
 * This file contains a utility function which retrieves
 * type names by converting an object's prototype or
 * constructor to a string, then retrieving its name
 */

export default (obj) => {
  const str = (obj.prototype
    ? obj.prototype.constructor
    : obj.constructor
  ).toString();

  // find functions in obj
  const matched = str.match(/function\s(\w*)/);

  if (matched != null) {
    const ctorName = matched[1];
    const aliases = ["", "anonymous", "Anonymous"];
    return aliases.indexOf(ctorName) > -1 ? "Function" : ctorName;
  }

  return null;
};
