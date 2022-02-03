/**
 * determines a condition of the chart
 * @private
 * @param {*} conditionFunc 
 */
function condition (conditionFunc) {
  if (!arguments.length) return this.__execs__.condition;
  this.__execs__.condition = conditionFunc.call(this, this.__attrs__.dimensions, this.__attrs__.measures);
  return this;
}

export default condition;