import { dispatch } from 'd3';
import distDomain from './distDomain';
import limitViewInterval from './limitViewInterval';
import stream from './stream';
import streamPanning from './streamPanning';
import tempPosForOrdinalScale from './tempPosForOrdinalScale'
import viewInterval from './viewInerval';
const _attrs = {
  viewInterval : null,
  stream: null
}

const streamMixin = Base => {
  /**
   * @mixin StreamMixin
   */
  let StreamMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
      this.__execs__.viewInterval = null;
      this.__execs__.stream = null;
      this.__execs__.streamPanning = null;
      this.__execs__.streamPanningDispatch = dispatch('streamPanning');
      this.rebindOnMethod(this.__execs__.streamPanningDispatch);
    }
  }
  StreamMixin.prototype.distDomain = distDomain;
  StreamMixin.prototype.limitViewInterval = limitViewInterval;
  StreamMixin.prototype.stream = stream;
  StreamMixin.prototype.streamPanning = streamPanning;
  StreamMixin.prototype.tempPosForOrdinalScale = tempPosForOrdinalScale;
  StreamMixin.prototype.viewInterval = viewInterval;

  return StreamMixin;
}

export default streamMixin;
