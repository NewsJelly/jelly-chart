import {setAttrs, setMethodsFromAttrs} from './util'

const attrs = {
  customDomain: null,
  level: 0, //level in hierarchy
  munged: null, //nested data
  target: null, //x|y|region
  format: null, //string|number|date|mixed
  field: null, //fieldname
}

class Field {
  constructor(field) {
    setAttrs(this, attrs);
    this.__execs__ = {};
    this.setInit(field, ['field', 'format', 'customDomain']);
  }
  setInit(source, attrNames = []) {
    if (source) {
      attrNames.forEach(n => {
        if (source[n]) this[n](source[n]);
      })
    }
    return this;
  }
  axis(at) {
    if (!arguments) return this.__execs__.axis;
    if (at && typeof at === 'object') {
      if (at !== this.__execs__.axis) this.__execs__.axis = at;
      at.field = this.mixed ? this.concatFields() : this.field();
      at.tickFormat = this.format();
    }
    return this;
  }
  toObject() {
    return {field: this.field(), format: this.format(), customDomain: this.customDomain()}
  }
}
setMethodsFromAttrs(Field, attrs);

export default Field;