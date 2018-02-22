import RectLinear from '../rectLinear/';
import seriesMixin from '../seriesMixin';
import brushMixin from '../brushMixin';
import paddingMixin from '../paddingMixin';
import shapeMixin from '../shapeMixin';
import {genFunc, mix} from '../../modules/util';
import conditionForMute from '../core/_condtionForMute';
import _munge from './_munge';
import _scale from './_scale';
import _mark from './_mark';
import _axis from './_axis';
import _legend from './_legend';
import _region from './_region';
import _facet from './_facet';
import _brush from './_brush';

const size = {range: [1,1], scale: 'linear', reverse: false};
const shapes = ['par-coords', 'scatter-matrix'];
const conditions = ['normal', 'color'];
const _attrs = {
  regionPadding: 0.1,
  size: size,
  shape: shapes[0]
};

/**
 * renders a parallel coordinates
 * @class ParCoords
 * @augments Core
 * @augments RectLinear
 * @augments SeriesMixin
 * @augments BrushMixin
 * @augments PaddingMixin
 * @augments ShapeMixin
 */
class ParCoords extends mix(RectLinear).with(seriesMixin, brushMixin, paddingMixin, shapeMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.brush(true);
  }

  isColor() {
    return this.condition() === conditions[1];
  }
  
  muteRegions(callback) { 
    let _parCoords = region => {
      this.mute(region, this.muteIntensity());
    }
    let _matrix = region => {
      let nodes = region.selectAll(this.nodeName()).classed('mute', true);
      this.mute(nodes, this.muteIntensity());
    }
    if (!arguments.length) {
      if (this.shape() === shapes[0]) {
        return this.filterRegions().call(_parCoords);
      } else {  
        return this.regions().selectAll(this.regionName())  
          .call(_matrix);
      }
    } 
    if (this.shape() === shapes[0]) {
      return this.filterRegions(conditionForMute(callback), true).call(_parCoords);
    } else {
      return this.regions().selectAll(this.regionName()).filter(conditionForMute(callback)).call(_matrix);
    }
  }
  
  demuteRegions(callback) {
    let _parCoords = region => {
      this.demute(region);
    }
    let _matrix = region => {
      let nodes = region.selectAll(this.nodeName());
      this.demute(nodes);
    }
    if (!arguments.length) {
      if (this.shape() === shapes[0]) {
        return this.filterRegions().call(_parCoords);
      } else {  
        return this.regions().selectAll(this.regionName())  
          .call(_matrix);
      }
    }
    if (this.shape() === shapes[0]) {
      return this.filterRegions(conditionForMute(callback), true).call(_parCoords);
    } else {
      return this.regions().selectAll(this.regionName()).filter(conditionForMute(callback)).call(_matrix);
    }
  }
  
  muteFromLegend(legend) {
    this.muteRegions(legend.key);
  }
  
  demuteFromLegend(legend) {
    this.demuteRegions(legend.key);
  }
  
  renderLayout(keep) { 
    if (this.shape() === shapes[0] && this.axisX()) {
      let findIndex = this.axis().findIndex(d => d.target === 'x');
      if (findIndex >= 0) {
        this.axis().splice(findIndex, 1);
      }
    }
    this.reset(keep);
    this.renderFrame();
    _munge.call(this);
    _scale.call(this, keep);
    this.renderCanvas();
    _axis.call(this);
    if (this.shape !== shapes[0] || this.isColor()) _region.call(this);
    if (this.shape() === shapes[0]) {
      _mark.call(this); 
    } else {
      _facet.call(this);
    }
    
    _legend.call(this);
    _brush.call(this);
  }
  
}

function xMeasureName (measure) {
  return 'x-' + (measure.field ? measure.field : measure);
}

function yMeasureName (measure) {
  return 'y-' + (measure.field ? measure.field : measure);
}

export default genFunc(ParCoords);
export {xMeasureName, yMeasureName, conditions, shapes};
