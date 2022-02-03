import {dispatch} from 'd3';
import {setMethodsFromAttrs} from '../../modules/util';

import pointNum from './pointNum';
import zoom from './zoom';
import zoomExtent from './zoomExtent';
import zoomed from './zoomed';
import zoomGen from './zoomGen';
import zoomTransform from './zoomTransform';

const _attrs = {
  zoom : false,
  zoomGen: null
}

const zoomMixin = Base => {
  /**
   * @mixin ZoomMixin
   */
  let ZoomMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
      this.__execs__.zoom = null;
      this.__execs__.zoomDispatch = dispatch('zoom');
      this.rebindOnMethod(this.__execs__.zoomDispatch);
    }
  }
  ZoomMixin.prototype.pointNum = pointNum;
  ZoomMixin.prototype.zoom = zoom;
  ZoomMixin.prototype.zoomed = zoomed;
  ZoomMixin.prototype.zoomExtent = zoomExtent;
  ZoomMixin.prototype.zoomGen = zoomGen;
  ZoomMixin.prototype.zoomTransform = zoomTransform;
  ZoomMixin.prototype.isBrushZoom = isBrushZoom;
  setMethodsFromAttrs(ZoomMixin, _attrs);
  return ZoomMixin;
}

function isBrushZoom() {
  return this.__attrs__.zoom && this.__attrs__.zoom === 'brush';
}


export default zoomMixin;