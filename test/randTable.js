function randUniform(min, max) {
  let dist = max - min;
  return (Math.random()*dist) + min;
}
function rand(key, i) {
  if (key.type === 'category') {
    let code = (i % key.cycle) + 65;
    let j = 0;
    let result = [];
    while (j < key.length) {
      result.push(code);
      j++;
    }
    return String.fromCharCode.apply(null, result);
  } else if (key.type === 'number') {
    return randUniform(key.range[0],  key.range[1]);
  } else if (key.type === 'date') {
    let val = randUniform(key.range[0].getTime(), key.range[1].getTime());
    return new Date(val);
  }
  return 0;
}

const defaultRange = [0, 100];
const defaultCycle = 10;
const defaultLength = 3;
const defaultDateRange = [new Date(2018, 0, 1), new Date(2018, 11, 31)];

module.exports = function(keys = [], rows = 100) {
  //key = {field, type, cycle, range}
  let i = 0;
  keys.map(k => {
    if (k.type === 'category') {
      if (!k.cycle) k.cycle = defaultCycle;
      if (!k.length) k.length = defaultLength;
    } else if (k.type === 'number' && !k.range) {
      k.range = defaultRange;
    } else if (k.type === 'date' && !k.range) {
      k.range = defaultDateRange;
    }
  });
  let result = [];
  while (i < rows) {
    result.push(keys.reduce((last, cur) => {
      last[cur.field] = rand(cur, i)
      return last;
    }, {}));
    i++;
  }
  return result;
}