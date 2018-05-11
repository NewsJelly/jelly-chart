import { drag, event } from 'd3';

function getDistPerPixel(scale) {
  const to =  + scale.invert(scale.range()[0] + 1);
  const from =  + scale.invert(scale.range()[0]);
  return to - from;
}

function streamPanning(scale, renderFunc){
  let streamPanning = this.__execs__.streamPanning;
  if (!streamPanning) {
    streamPanning = drag();
    const field = this.__execs__.field;
    const axisObj = this.__execs__.axis;
    const axisX = axisObj && axisObj.x ? axisObj.x[field.x.field()] : null;
    const canvas = this.__execs__.canvas;
    const markProcCall = this.process().find(p => p.type === 'mark').call;
    const tooltipProcCall = this.process().find(p => p.type === 'tooltip').call;
    const isContinous = 'invert' in scale;
    const renderFuncDefault = (domain, duration = 0) => {
      scale._lastDomain = domain;
      scale.domain(domain);
      const transition = this.transition();
      this.transition({duration: duration, delay: 0})
      if (renderFunc) renderFunc();
      markProcCall.call(this);
      this.resetTooltip();
      tooltipProcCall.call(this);
      axisX.render(null, true);
      this.transition(transition);
    }
    this.__execs__.streamPanning = streamPanning;
    if (isContinous) {
      const isTime = scale.domain()[0] instanceof Date;
      streamPanning.on('drag.streamPanning', function() {
        const curDomain = scale.domain();
        const distPerPixel = getDistPerPixel(scale);
        const defaultDomain = scale._defaultDomain;
        const dx = event.dx * -1;
        const dist = distPerPixel * dx;
        const updateCondition = (dx > 0 && +curDomain[curDomain.length-1] + dist <= +defaultDomain[defaultDomain.length-1]) ||  (dx < 0 && +curDomain[0] + dist >= +defaultDomain[0]);
        if (updateCondition) {
          renderFuncDefault(curDomain.map(d => isTime? new Date(+d + dist): d + dist));
        }
      })
    } else {
      let accumDx = 0;
      streamPanning.on('start.streamPanning end.streamPanning', function() {
        accumDx = 0;
      }).on('drag.streamPanning', function() {
        const step = scale.step();
        accumDx += event.dx;
        const absAccumDx = Math.abs(accumDx);
        if (absAccumDx >= scale.step()) {
          const curDomain = scale.domain();
          const defaultDomain = scale._defaultDomain;
          const initIndex = defaultDomain.findIndex(d => d === curDomain[0]);
          let dist = Math.floor(absAccumDx / step);
          dist *= (accumDx > 0 ? -1 : 1);
          const updateCondition = (dist > 0 && initIndex + curDomain.length + dist < defaultDomain.length) || (dist < 0 && initIndex + dist >= 0);
          if (updateCondition) {
            renderFuncDefault(defaultDomain.slice(initIndex + dist, initIndex + curDomain.length + dist), 400);
          }
          accumDx = 0;
        } 
      })
    }
    
    canvas.call(streamPanning);
  }
  return this;
}
export default streamPanning;

