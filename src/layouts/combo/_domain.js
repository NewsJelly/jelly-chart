import {domainY as domainYBar} from '../bar';
import {domainY as domainYLine} from '../line';
import {scaleBand, scaleLinear} from 'd3';

function _domain(keep) {
  const munged = this.__execs__.munged;
  const {x, yBar, yLine} = this.__execs__.field;
  const yAt = this.axisY();
  
  if (yAt && yAt.orient === 'left') { //add the right axis directly
    const yAtRight = Object.assign({}, yAt);
    yAtRight.orient = 'right';
    this.axis(yAtRight);
  }
  const xDomain = x.level(0).munged(munged).domain(this.sortByValue());
  const scale = this.scale();
  scale.x = scaleBand().padding(this.padding()).domain(xDomain);
  scale.yBar = scaleLinear();
  scale.yLine = scaleLinear();

  this.setCustomDomain('yBar', domainYBar(yBar, munged));
  this.setCustomDomain('yLine', domainYLine(yLine, munged));
  scale.color = this.updateColorScale(this.measures().map(d => d.field), keep);
}



export default _domain;