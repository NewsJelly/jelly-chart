import Facet from '../facet/';
import zoomMixin from '../zoomMixin';
import brushMixin from '../brushMixin';
import fitLineMixin from '../fitLineMixin';
import paddingMixin from '../paddingMixin';
import {genFunc, mix} from '../../modules/util';
import _munge from './_munge';
import _scale from './_scale';
import _mark from './_mark';
import _axis from './_axis';
import _legend from './_legend';
import _region from './_region';
import _facet from './_facet';
import _fitLine from './_fitLine';
import _tooltip from './_tooltip';
import _zoom from './_zoom';

const size = {range: [3, 12], scale: 'linear', reverse: false};
const conditions = ['normal', 'color', 'bubble', 'mixed'];
const _attrs = {
  regionPadding: 0.1,
  size: size
};

/**
 * rendes a scatter chart
 * @class Scatter
 * @augments Facet
 * @augments FintLineMixin
 * @augments BrushMixin
 * @augments ZoomMixin
 * @augments PaddingMixin
 */
class Scatter extends mix(Facet).with(fitLineMixin, brushMixin, zoomMixin, paddingMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
  }
  isColor() {
    return this.condition() === conditions[1] || this.condition() === conditions[3];
  }
  
  isSized() {
    return this.condition() === conditions[2] || this.condition() === conditions[3];
  }
  
  isFacet() {
    return this.facet() && this.isColor();
  }
  
  muteFromLegend(legion) {
    this.muteRegions(legion.key);
  }
  
  
  demuteFromLegend(legion) {
    this.demuteRegions(legion.key);
  }
  
  muteToLegend(d) {
    this.muteLegend(d.parent.data.key);
  }
  
  demuteToLegend(d) {
    this.demuteLegend(d.parent.data.key);
  }
  
  renderLayout(keep) { 
    this.reset(keep);
    this.renderFrame();
    _munge.call(this);
    _scale.call(this, keep);
    this.renderCanvas(this.size().range[this.isSized() ? 1 : 0]*1.25);
    _axis.call(this);
    _fitLine.call(this);
    _region.call(this);
     if(this.isFacet()) {
       _facet.call(this);
     } else {
       _mark.call(this); 
     }
    _legend.call(this);
    _tooltip.call(this);
    _zoom.call(this);
  }
}

export default genFunc(Scatter);
export {conditions};
