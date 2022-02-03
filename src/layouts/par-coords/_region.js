import {shapes} from './';

function _region() {
  const isColor = this.isColor();
  const color = this.color();
  const shape = this.shape();
  const scale = this.__execs__.scale;

  let __regionLocal = d => {
    if (shape === shapes[0]) {
      d.x = 0; d.y = 0;
      d.color = isColor ? scale.color(d.data.key) : color[0];
    } else {
      d.x = scale.region(d.xField.field);
      d.y = scale.region.range()[1] - scale.region(d.yField.field) - scale.region.bandwidth();
    }
  };

  this.renderRegion(__regionLocal, d => d, shape === shapes[1], (shape === shapes[1] ? '.matrix': '' ))
    .style('stroke', d => d.color);
}

export default _region;