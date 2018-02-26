import {xMeasureName, yMeasureName} from './';

function parCoords() {
  const scale = this.scale();
  const innerSize = this.innerSize();
  const measures = this.measures();
  scale.x.rangeRound([0,innerSize.width]);
  measures.forEach(m => {
    let scaleName = yMeasureName(m);
    scale[scaleName].rangeRound([innerSize.height, 0])
  });
}

function matrix() {
  const scale = this.scale();
  const innerSize = this.innerSize();
  const measures = this.measures();
  let regionWidth = Math.min(innerSize.width, innerSize.height);
  scale.region.rangeRound([0, regionWidth]).padding(this.regionPadding());
  measures.forEach(m => {
    let yScaleName = yMeasureName(m);
    scale[yScaleName].rangeRound([scale.region.bandwidth(), 0]);
    let xScaleName = xMeasureName(m);
    scale[xScaleName].rangeRound([0, scale.region.bandwidth()]);
  });
}


function _range(keep) {
  if (this.isParcoords()) parCoords.call(this, keep);
  else matrix.call(this, keep);
}

export default _range;