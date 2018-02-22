import {max} from 'd3';

function pointNum(nested = false) {
  if (nested) {
    return max(this.__execs__.munged, d=> d.children.length);
  } else {
    return this.__execs__.munged.length;
  }
}

export default pointNum;