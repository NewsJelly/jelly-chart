function adjustDomain(scale, from, to) {
  let result = [];

  if (to[0] > from[0]) result[0] = from[0];
  else result[0] = to[0];

  if (to[1] < from [1]) result[1] = from[1];
  else result[1] = to[1];
  
  scale.domain(result);
  if (from[0] === result[0] && from[1] === result[1]) scale.nice();
}

/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} target 
 * @param {*} domain 
 * @param {*} fromScale 
 */
function setCustomDomain(target, domain, fromScale = false) {
  let scale = fromScale ? target : this.__execs__.scale[target];
  let field = fromScale ? null : this.__execs__.field[target];
  scale._defaultDomain = domain;
  if (fromScale) {
    scale.domain(domain).nice();
  } else if (this.customDomain()) {
    adjustDomain(scale, domain, this.customDomain());
  } else if ((this.isMixed ? !this.isMixed() : true) && field.customDomain()) { //use field's customDomain
    adjustDomain(scale, domain, field.customDomain());
  } else {
    scale.domain(domain).nice();
  }
  return this;
}

export default setCustomDomain;