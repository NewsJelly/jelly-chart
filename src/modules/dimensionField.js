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
  domain(sortByValue = false, accessor = null, multipleDomain = false) {
    const munged = this.munged();
    const level = this.level();
    const order = this.order();
    const needMultipleDomain = sortByValue !== 'natural' && multipleDomain;
    let curLevel = 0;
    let duplicateDomain = [];
    function _fill(nodes, setDomain, curLevel) {
      if (curLevel === level) {
        const residual = setDomain.filter(d => !nodes.find(n => n === d));
        return nodes.concat(residual);
      } else {
        return nodes.map(d => { 
          d.values = _fill(d.values, setDomain, curLevel + 1)
          return d;
        })
      }
    }
    function _keys(nodes, curLevel) {
      if (curLevel === level) {
        // const domain = nodes.map(accessor ? accessor : d => {return {key: d.data.key, value: d.value};});
        const domain = nodes.map(accessor ? accessor : d => {
          if (d.hasOwnProperty('data')) return {key: d.data.key, value: d.value};
          else {
            if(d.hasOwnProperty('children')) {
              return {key: d.key, children: d.children};
            } else {
              return {key: d.key, value: d.value};
            }
          }
        });
        if (needMultipleDomain) {
          duplicateDomain = duplicateDomain.concat(domain);
          return _domain(domain, false);
        } else {
          return domain;
        }
      } else {
        if (needMultipleDomain) {
          return nodes.map(d => {
           return {key: d.data.key, values: _keys(d.children, curLevel + 1)}
          })
        } else {
          return merge(nodes.map(d => _keys(d.children, curLevel + 1)));
        }
      }
    }
    function _domain(domain, duplicate = true) {
      if (duplicate) domain = _set(domain);
      if ((!sortByValue || sortByValue === 'natural') && order && order !== 'natural') domain.sort(comparator(order, [], true, d => d.key)); 
      if (sortByValue && sortByValue !== 'natural') domain.sort(comparator(sortByValue, [], true, d => d.value)); 
      return domain.map(d => d.key);
    }

    function _set(domain) {
      let newDomain = [];
      domain.forEach(d => {
        if (!newDomain.find(n => n.key === d.key)) newDomain.push(d);
      })
      return newDomain;
    }
    let domain = _keys(munged, curLevel);
    if (needMultipleDomain) {
      const domainSet = _set(duplicateDomain).map(d => d.key);
      curLevel = 0;
      _fill(domain, domainSet, curLevel);
    } else {
      domain = _domain(domain);
    }
    return domain;
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