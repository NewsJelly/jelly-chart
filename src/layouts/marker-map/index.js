import {dispatch} from 'd3';
import Default from '../core';
import {attrFunc, genFunc, rebindOnMethod} from '../../modules/util';
import _munge from './_munge';
import _map from './_map';
import _scale from './_scale';
import _mark from './_mark';

const latMeasure = {field: '__--jelly-lat--__'};
const lngMeasure = {field: '__--jelly-lng--__'};

const size = {range: [0.5, 4], scale: 'linear', reverse: false};
const conditions = ['normal', 'point'];
const _attrs = {
  addr: false,
  mapBaseType: 'ROADMAP',// ROADMAP SKYVIEW HYBRID
  overlayMapType: null, // OVERLAY TERRAIN TRAFFIC BICYCLE BICYCLE_HYBRID USE_DISTRICT
  size: size,
};

/**
 * @class MarkerMap
 * @augments Default
 */
class MarkerMap extends Default {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.__execs__.dispatch = dispatch('loading', 'end');
    rebindOnMethod(this, this.__execs__.dispatch);
  }
  isSized() {
    return this.condition() === conditions[0];
  }
  renderLayout() { 
    this.reset();
    _munge.call(this);
    _scale.call(this);
    _map.call(this, this.container());
    _mark.call(this); 
  }
}

/**
 * If addr is specified sets the addr setting and returns the MarkerMap instance itself. If addr is true, use addresses to find coordinates from data. The field possessing address type data, should be the first arguments of .measures method. If is not specified, returns the current addr setting.
 * @function
 * @example
 * markerMap.addr(true)
 * @param {boolean} [addr=false]
 * @return {addr|MarkerMap}
 */
MarkerMap.prototype.addr = attrFunc('addr');
MarkerMap.prototype.mapBaseType = attrFunc('mapBaseType');
MarkerMap.prototype.overlayMapType = attrFunc('overlayMapType');

export default genFunc(MarkerMap);
export {conditions, latMeasure, lngMeasure};
