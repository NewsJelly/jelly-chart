import {select, ascending, transition, extent} from 'd3';
import {labelFormat, className} from '../../modules/util';

function _mark() {
  const that = this;
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const innerSize = this.innerSize();
  const padding = this.padding();
  const labelFont = this.labelFont();
  const borderColor = this.borderColor();
  const colorValue =  d => scale.color(d.value);
  const textValue = d => labelFormat(d.value);

  function wrap() {
    let rectWidth = innerSize.width / (scale.x.domain().length + 1);
    let self = select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text();
    while (textLength > (rectWidth - 2 * padding) && text.length > 0) {
      text = text.slice(0, -1);
      self.text(text + '...');
      textLength = self.node().getComputedTextLength();
    }
  }

  let __local = function (selection) {
    selection.each(d => {
      d.color = colorValue(d);
      d.text = textValue(d);
    });
  }

  let __rowHeader = function (selection) {
    let width = innerSize.width / (scale.x.domain().length + 1);
    let height = innerSize.height / (scale.y.domain().length + 1);
    selection
        .attr('width', width)
        .attr('height', height)
        .style('stroke', borderColor)
        .style('fill', '#d9d9d9');
  }

  let __rowHeaderLabel = function (selection) {
    let x = (innerSize.width / (scale.x.domain().length + 1) / 2);
    let y = (innerSize.height / (scale.y.domain().length + 1) / 2);
    selection
        .attr('x', x)
        .attr('y', y)
        .attr('dy', '.35em')
        .style('font-size', '12px')
        .style('font-weight', 'normal')
        .style('text-anchor', 'middle')
        .append('tspan')
        .text(d => d.data.key).each(wrap);
  }

  let __colHeader = function (selection) {
    let width = innerSize.width / (scale.x.domain().length + 1);
    let height = innerSize.height / (scale.y.domain().length + 1);
    selection
        .attr('width', width)
        .attr('height', height)
        .style('stroke', borderColor)
        .style('fill', '#d9d9d9');
  }

  let __colHeaderLabel = function (selection) {
    let x = (innerSize.width / (scale.x.domain().length + 1) / 2);
    let y = (innerSize.height / (scale.y.domain().length + 1) / 2);
    selection
        .attr('x', x)
        .attr('y', y)
        .attr('dy', '.35em')
        .style('font-size', '12px')
        .style('font-weight', 'normal')
        .append('tspan')
        .text(d => d).each(wrap);
  }

  let __dataGrid = function (selection) {
    let width = innerSize.width / (scale.x.domain().length + 1);
    let height = innerSize.height / (scale.y.domain().length + 1);
    selection
        .attr('width', width)
        .attr('height', height)
        .style('fill', d => d.color);
  }

  let __dataGridLabel = function (selection) {
    let x = (innerSize.width / (scale.x.domain().length + 1) / 2);
    let y = (innerSize.height / (scale.y.domain().length + 1) / 2);
    selection
        .attr('x', x)
        .attr('y', y)
        .attr('dy', '.35em')
        .attr('fill', '#333333')
        .style('font-size', labelFont && labelFont.hasOwnProperty('font-size') ? labelFont['font-size'] : '12px')
        .style('font-weight', labelFont && labelFont.hasOwnProperty('font-weight') ? labelFont['font-weight'] : 'normal')
        .style('text-anchor', 'middle')
        .append('tspan')
        .text(d => d.text).each(wrap);
  }

  let __appendTable = function (selection) {
    // header render
    let rowHeader = canvas.selectAll(className('regions', true))
        .selectAll(className('row-header', true)).data(d => d);
    rowHeader.exit().remove();
    let rowHeaderEnter = rowHeader.enter().append('g')
        .attr('class', className('row-header'));
    rowHeaderEnter.append('rect')
        .call(__rowHeader);
    rowHeaderEnter.append('text')
        .call(__rowHeaderLabel);
    rowHeader = rowHeaderEnter.merge(rowHeader)
        .attr('transform', function(_, i) {
          let x = innerSize.width / (scale.x.domain().length + 1) * (i + 1);
          let y = 0;
          return 'transform', 'translate(' + [x, y] +')';
        });

    let colHeader = canvas.selectAll(className('regions', true))
        .selectAll(className('col-header', true)).data(scale.y.domain());
    colHeader.exit().remove();
    let colHeaderEnter = colHeader.enter().append('g')
        .attr('class', className('col-header'));
    colHeaderEnter.append('rect')
        .call(__colHeader);
    colHeaderEnter.append('text')
        .call(__colHeaderLabel);
    colHeader = colHeaderEnter.merge(colHeader)
        .attr('transform', function(_, i) {
          let x = 0;
          let y = innerSize.height / (scale.y.domain().length + 1) * (i + 1);
          return 'transform', 'translate(' + [x, y] +')';
        });

    // data grid render
    let dataGrid = selection.selectAll(that.nodeName(true)).data(d => d.children, d => d.data.key);
    dataGrid.exit().remove();
    let dataGridEnter = dataGrid.enter().append('g')
        .attr('class', that.nodeName(true))
        .call(__local);
    dataGridEnter.append('rect')
        .call(__dataGrid);
    dataGridEnter.append('text')
        .call(__dataGridLabel);
    dataGrid = dataGridEnter.merge(dataGrid)
        .attr('transform', function(_, i) {
          let x = 0;
          let y = innerSize.height / (scale.y.domain().length + 1) * i;
          return 'transform', 'translate(' + [x, y] +')';
        });

  }

  let region = canvas.selectAll(this.regionName());
  region.call(__appendTable);
}

export default _mark;