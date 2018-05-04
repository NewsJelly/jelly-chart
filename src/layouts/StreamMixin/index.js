import distDomain from './distDomain';
import limitViewInterval from './limitViewInterval';
import stream from './stream';
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
    }
  }
  StreamMixin.prototype.distDomain = distDomain;
  StreamMixin.prototype.limitViewInterval = limitViewInterval;
  StreamMixin.prototype.stream = stream;
  StreamMixin.prototype.tempPosForOrdinalScale = tempPosForOrdinalScale;
  StreamMixin.prototype.viewInterval = viewInterval;

  return StreamMixin;
}

export default streamMixin;
