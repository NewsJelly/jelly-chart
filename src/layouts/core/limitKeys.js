/**
 * limits the number of nodes length as many as limitNumber.
 * @memberOf Core#
 * @function
 * @example
 * core.limitKeys(10);
 * @param {number} limitNumber
 * @return {Core}
 */
function limitKeys(limitNumber) {
  let _limit = function (target, num, level, maxLevel) {
    target = target.slice(0, num);
    if (level < maxLevel) target.forEach(d => d.children = _limit(d.children, num, level+1, maxLevel))
    return target;
  }
  if(!arguments.length) {
    let num = this.__attrs__.limitKeys;
    if (num) {
      let munged = this.__execs__.munged;
      let nestedLevel = this.dimensions().length;
      let result = _limit(this.aggregated() ? munged.children : munged, num, 1 , nestedLevel);
      if (this.aggregated()) {
        munged.children = result;
        result = munged;
      }
      this.__execs__.munged = result;
    }
  } else {
    this.__attrs__.limitRows = limitNumber;
  }
  return this;
}

export default limitKeys;