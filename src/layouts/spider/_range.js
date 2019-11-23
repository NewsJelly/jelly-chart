import {yMeasureName} from './';

function _range() {
  const scale = this.scale();
  const innerSize = this.innerSize();
  const measures = this.measures();
  scale.x.rangeRound([0, innerSize.width]);
  measures.forEach(m => {
    let scaleName = yMeasureName(m);
    scale[scaleName].rangeRound([innerSize.height, 0]);
  });
}

export default _range;