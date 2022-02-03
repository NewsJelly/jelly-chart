function gen(type, call, option) {
  return {type, call, allow: option.allow, isPre: option.isPre};  
}
/**
 * sets and gets rendering procedures.
 * @memberOf Core#
 * @function
 * @param {string} [type] 
 * @param {function} [call] 
 * @param {object} [option]
 * @param {string} option.after
 * @param {function} option.allow
 * @return {process|process[]|Core}
 */
function process(type, call, option={}) {
  if (!this.__process__) this.__process__ = [];
  if (!arguments.length) return this.__process__;
  const process = this.__process__;
  if (call && typeof call === 'function') {
    const existing = process.findIndex(p => p.type === type);
    if (existing >=0) { //renew existing
      process[existing] = gen(type, call, option);
    } else {
      process.splice(process.length, 0, gen(type, call, option)); //insert new proc
    }
    return this;
  } else {
    return process.find(p => p.type === type);
  }
}

export default process;