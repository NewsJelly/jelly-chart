import {merge} from 'd3';
import Field from './field';
import {setAttrs, setMethodsFromAttrs} from './util';
import {comparator} from './transform';


const attrs = {
  interval: null,
  max: 100,
  order: 'natural' //natural|ascending|descending
}

class DimensionField extends Field {
  constructor(dimension) {
    super(dimension);
    setAttrs(this, attrs);
    this.setInit(dimension, ['interval', 'max', 'order']);
  }
  domain(sortByValue = false, accessor) {
    const munged = this.munged();
    const level = this.level();
    const order = this.order();
    let domain = [];
    let curLevel = 0;
    function _keys(values, curLevel) {
      if (curLevel === level) {
        return values.map(accessor ? accessor : d => {return {key: d.data.key, value: d.value};});
      } else {
        return merge(values.map(d => _keys(d.children, curLevel + 1)));
      }
    }
    domain = _keys(munged, curLevel);
    let newDomain = [];
    domain.forEach(d => {
      if (newDomain.findIndex(n => n === d) < 0) {
        newDomain.push(d);
      }
    })
    domain = newDomain;
    if ((!sortByValue || sortByValue === 'natural') && order && order !== 'natural') domain.sort(comparator(order, [], true, d => d.key)); 
    if (sortByValue && sortByValue !== 'natural')  domain.sort(comparator(sortByValue, [], true, d => d.value)); 
    return domain.map(d => d.key);
  }

  isInterval() {
    return this.interval() && this.format();
  }

  toObject() {
    let def = super.toObject();
    def.interval = this.interval();
    def.max =  this.max();
    def.order = this.order()
    return def;
  }
}

function dimensionField(dimension) {
  return new DimensionField(dimension);
}

setMethodsFromAttrs(DimensionField, attrs);

export default dimensionField;