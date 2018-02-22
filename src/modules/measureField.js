import {extent} from 'd3';
import Field from './field';
import {setAttrs, setMethodsFromAttrs} from './util';

const countMeasureTitle = ' ';
const countMeasure = {field: '__--jelly_count_measure--__', op: 'count'}; 
const mixedMeasure = {field: '__--jelly_mixed_measure--__', op: 'mean'}; 

const attrs = {
  aggregated: false, //already aggregated
  op: 'mean',
  mixed: false,
  measures: [] //when mixed, get measures
}

class MeasureField extends Field {
  constructor(measure) {
    super(measure);
    setAttrs(this, attrs);
    this.setInit(measure, ['op']);
  }
  domain(padding = 0, stacked = false, allowMono = false) {
    const level = this.level();
    const munged = this.munged();

    let curLevel = 0;
    let domain = [];
    let field = this.valueName();
    function _value(target, curLevel) {
      target.forEach(function(d) {
        if(curLevel < level) {
          _value(d.children, curLevel+1);
        } else {
          if (stacked) {
            domain.push(d.data.value[field + '-start'] );
            domain.push(d.data.value[field + '-end'] );
          } else {
            domain.push(d.data.value[field]);
          }
        }
      });
    }
    _value(munged, curLevel);
    domain = extent(domain);
    if (domain[0] === domain[1] && !allowMono) { //when min and mix is the same
      const offset = domain[0] * 0.2;
      domain[0] -= offset;
      domain[1] += offset;
    }

    if(padding <= 0) return domain;
    let dist = Math.abs(domain[0] - domain[1]);
    dist *= padding * 0.5;
    return [domain[0] - dist, domain[1] + dist];
  }

  concatFields() {
    if (this.mixed()) {
      if (this.measures().length > 0) return this.measures().map(d => d.field).join('-');
      else return '';
    }
    else if (this.field() === mixedMeasure.field) return '';
    else return this.field();
  }

  valueName() {
    let fieldName = this.field();
    return fieldName + (this.mixed() || (fieldName === mixedMeasure.field && this.aggregated())? '' : '-' + this.op()); 
  }

  toObject() {
    let def = super.toObject();
    def.op = this.op();
    return def;
  }
}

function measureField(measure) {
  return new MeasureField(measure);
}

setMethodsFromAttrs(MeasureField, attrs);

export {countMeasure, countMeasureTitle, mixedMeasure};
export default measureField;