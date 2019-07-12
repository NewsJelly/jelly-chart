import {className} from '../../modules/util';

function _axis() {
  const canvas = this.__execs__.canvas;
  const measures = this.measures();
  const margin = this.margin();
  const legend = this.__attrs__.legend;
  const innerSize = this.innerSize();
  const chartSize = Math.min(innerSize.width, innerSize.height);
  const width = (chartSize - margin.left - margin.right);
  const height = (chartSize - margin.top - margin.bottom);
  const radian = 2 * Math.PI;
  const cntAxis = measures.length;
  const level = this.__attrs__.level;
  const radius = Math.min(width / 2, height / 2);
  const font = this.font();

  let __appendLevels = function(selection) {
    for (let i = 0; i < level; i++) {
      let levelFactor = radius * ((i + 1) / level);
      let axisLevels = selection.selectAll(className('level'))
        .data(measures);
      axisLevels.exit().remove();
      axisLevels = axisLevels.enter()
        .append('line')
        .attr('class', className('level'))
        .attr('x1', (d,i) => {
          return levelFactor * (1 - Math.sin(i * radian / cntAxis));
        })
        .attr('y1', (d,i) => {
          return levelFactor * (1 - Math.cos(i * radian / cntAxis));
        })
        .attr('x2', (d,i) => {
          return levelFactor * (1 - Math.sin((i + 1) * radian / cntAxis));
        })
        .attr('y2', (d,i) => {
          return levelFactor * (1 - Math.cos((i + 1) * radian / cntAxis));
        })
        .attr('transform', 'translate(' + (width / 2 - levelFactor) + ', ' + (height / 2 - levelFactor) + ')')
        .attr('stroke', '#7b92ae')
        .attr('stroke-width', '0.5px')
    }
  };

  let __appendAxis = function(selection) {
    let axis = selection.selectAll(className('axis'))
      .data(measures);
    axis.exit().remove();
    axis.enter()
      .append('line')
      .attr('class', className('axis'))
      .attr('x1', width / 2)
      .attr('y1', height / 2)
      .attr('x2', (d,i) => {
        return width / 2 * (1 - Math.sin(i * radian / cntAxis));
      })
      .attr('y2', (d,i) => {
        return height / 2 * (1 - Math.cos(i * radian / cntAxis));
      })
      .attr('stroke', '#7b92ae')
      .attr('stroke-width', '1px');
  };

  let __appendAxisLabels = function(selection) {
    let axisLabel = selection.selectAll(className('label'))
      .data(measures);
    axisLabel.exit().remove();
    axisLabel.enter()
      .append('text')
      .attr('class', className('label'))
      .attr('text-anchor', (d,i) => {
        if ((i * radian / cntAxis === Math.PI) || Math.sin(i * radian / cntAxis) === 0) {
          return 'middle';
        } else if (Math.sin(i * radian / cntAxis) > 0) {
          return 'end';
        } else if (Math.sin(i * radian / cntAxis) < 0) {
          return 'start';
        }
      })
      .attr('x', (d,i) => {
        return width / 2 * (1 - 1.15 * Math.sin(i * radian / cntAxis));
      })
      .attr('y', (d,i) => {
        return height / 2 * (1 - 1.15 * Math.cos(i * radian /cntAxis));
      })
      .attr('font-family', font['font-family'])
      .attr('font-weight', font['font-weight'])
      .attr('font-style', font['font-style'])
      .attr('font-size', font['font-size'])
      .attr('fill', '#485465')
      .text(d => d.field);
  };

  let wTranslate = (innerSize.width - width) / 2;
  let hTranslate = 0;
  if (legend && legend.orient === 'top') {
    hTranslate = (innerSize.height - height) / 2 + (legend.thickness / 2);
  } else {
    hTranslate = (innerSize.height - height) / 2
  }
  let translate = wTranslate + ', ' + hTranslate;
  canvas.insert('g', ':first-child')
    .attr('transform', 'translate(' + translate + ')')
    .attr('class', className('axis-levels'))
    .call(__appendLevels);
  canvas.insert('g', ':first-child')
    .attr('transform', 'translate(' + translate + ')')
    .attr('class', className('axis'))
    .call(__appendAxis);
  canvas.insert('g', ':first-child')
    .attr('transform', 'translate(' + translate + ')')
    .attr('class', className('axis-ticks'))
    .call(__appendAxisLabels);
}

export default _axis;
