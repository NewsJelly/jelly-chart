import {scaleBand, scaleLinear} from 'd3';
import { domainY } from './index';

function _domain() { //set scales and domains
  const keep = this.keep();
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const nested = this.isNested();
  const stacked = this.stacked();
  const aggregated = this.aggregated();
  const field = this.__execs__.field;
  const isNestedAndSortByValue = this.isNestedAndSortByValue();
  const viewInterval = this.viewInterval();
const label = this.label();
const diffArrow = this.diffArrow();
const arrowOnMark = this.arrowOnMark();
const colorDomain = this.colorDomain();
const data = this.data();
  let yDomain, xDomain;
  let regionDomain;
  if (!(keep && scale.x && scale.y)) {
    scale.x = scaleBand().padding(this.padding());
    scale.y = scaleLinear();
  }

  if (nested) {
    regionDomain = field.region.level(0).munged(munged).domain();
    scale.region = scaleBand().domain(regionDomain).padding(this.regionPadding());
  }
  if (this.isFacet()) {
    scale.color = this.updateColorScale(regionDomain, keep);
    return this;
  }

  const level = 1;
  xDomain = field.x.level(level)
    .munged(munged)
    .domain(!isNestedAndSortByValue && this.sortByValue());

  if (nested || (!nested && (this.mono() === false || stacked))) { //nested
    scale.color = this.updateColorScale(xDomain, keep); //FIXME: need to update current colors
  }
  yDomain = domainY(field.y, munged, level, nested, aggregated, stacked, this.showDiff(), label, arrowOnMark);
  if (yDomain[0]*yDomain[1] < 0 && diffArrow) {
      if (Math.abs(yDomain[0] + yDomain[1]) > (Math.abs(yDomain[0]) + Math.abs(yDomain[1]))/3) {
          let isPlus = (yDomain[0] + yDomain[1] > 0) ? 1 : 0;
          if ((isPlus && diffArrow['value'] < 0) || (!isPlus && diffArrow['value'] > 0)){
              console.log(yDomain[isPlus ? 0 : 1]);
              console.log(yDomain[isPlus]/(2*yDomain[isPlus ? 0 : 1]));
            yDomain[isPlus ? 0 : 1] *= Math.abs(yDomain[isPlus])/(2*Math.abs(yDomain[isPlus ? 0 : 1]));
        }
      }
  }

  if (isNestedAndSortByValue) {
    xDomain = field.x.domain(this.sortByValue(), null, isNestedAndSortByValue);
    munged.forEach(d => d.domain = xDomain.find(x => x.key === d.data.key).values);
  } else if (stacked) {
    if (!nested) {
      scale.x.domain([field.x.field()]);
    }
  } else { //not stacked
    if (!keep && viewInterval) {
      xDomain = this.limitViewInterval(scale.x, xDomain);
    } else if (keep && this.stream()) { // if uses stream  and keeps the existing scale;
      xDomain = this.limitViewInterval(scale.x, xDomain, true);
    }
    scale.x.domain(xDomain);
  }
  this.setCustomDomain('y', yDomain);
  return this;
}

export default _domain;
