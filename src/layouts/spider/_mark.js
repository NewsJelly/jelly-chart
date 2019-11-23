import {transition, select, max} from 'd3';
import {className, labelFormat} from '../../modules/util';

function _mark() {
  const that = this;
  const munged = this.__execs__.munged;
  const scale = this.__execs__.scale;
  const canvas = this.__execs__.canvas;
  const measures = this.measures();
  const size = this.size();
  const margin = this.margin();
  const innerSize = this.innerSize();
  const chartSize = Math.min(innerSize.width, innerSize.height);
  const width = (chartSize - margin.left - margin.right);
  const height = (chartSize - margin.top - margin.bottom);
  const radian = 2 * Math.PI;
  const cntAxis = measures.length;
  const pointRatio = this.__attrs__.pointRatio;
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
  const formatString = this.__attrs__.formatString;
  const label = this.label();
  const legend = this.legend();

  // 각 Measures의 값 중 제일 큰 값을 가져옴
  let maxValue = this.__attrs__.maxValue;
  if (maxValue === null) {
    maxValue = max(munged.map(d => {
      return max(Object.values(d.data.value));
    }));
    this.__attrs__.maxValue = maxValue;
  }

  let __local = function(selection) {
    selection.each(function(d) {
      let children = d.children;
      children.forEach(function(data, i) {
        data.x = width / 2 * (1 - (Math.max(data.value, 0) / maxValue) * Math.sin(i * radian / cntAxis));
        data.y = height / 2 * (1 - (Math.max(data.value, 0) / maxValue) * Math.cos(i * radian / cntAxis));
        data.key = d.key;
        data.color = scale.color(d.key);
      });
    });
  };

  let __pointInit = function(selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection
        .attr('class', className('point'))
        .attr('r', (size.range[0] - size.range[0] / 4) * pointRatio)
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('stroke', d.color)
        .attr('fill', '#fff');
    });
  };

  let __point = function(selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection
        .transition(trans)
        .attr('class', className('point'))
        .attr('r', (size.range[0] - size.range[0] / 4) * pointRatio)
        .attr('cx', d.x)
        .attr('cy', d.y)
        .attr('stroke', d.color)
        .attr('fill', '#fff');
    });
  };

  let __dummyPoint = function(selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection
        .transition(trans)
        .attr('class', className('dummy'))
        .attr('r', (size.range[0] - size.range[0] / 4) * pointRatio)
        .attr('cx', d.x)
        .attr('cy', d.y)
        .attr('visible', 'hidden')
        .attr('opacity', '0')
    });
  }

  let __pathAreaInit = function(selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection
        .attr('class', className('area'))
        .attr('points', d => {
          let points = '';
          let children = d.children;
          children.forEach(function () {
            points += width / 2 + ',' + height / 2 + ' ';
          });
          return points;
        })
        .attr('stroke-width', '2px')
        .attr('fill-opacity', '0.15')
        .attr('stroke', d.color)
        .attr('fill', d.color);
    });
  };

  let __pathArea = function(selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection.transition(trans)
        .attr('points', d => {
          let points = '';
          let children = d.children;
          children.forEach(function (data) {
            points += data.x + ',' + data.y + ' ';
          });
          return points;
        })
        .attr('stroke', d.color)
        .attr('fill', d.color);
    });
  };

  // let __labelInit = function(selection) {
  //   selection.each(function(d) {
  //     let selection = select(this);
  //     selection.attr('class', className('label'))
  //       .attr('x', width / 2)
  //       .attr('y', height / 2)
  //       // .attr('dy', '-.45em')
  //       .style('visibility', label ? 'visible' : 'hidden')
  //       .style('fill', '#585656')
  //       .text(labelFormat(d.value, false, formatString));
  //   });
  // }
  //
  // let __label = function(selection) {
  //   selection.each(function(d) {
  //     let selection = select(this);
  //     selection.transition(trans)
  //       .attr('class', className('label'))
  //       .attr('text-anchor', 'middle')
  //       .style('visibility', label ? 'visible' : 'hidden')
  //       .style('fill', '#585656')
  //       .text(labelFormat(d.value, false, formatString));
  //
  //     // label x, y location setting
  //     let labelArea = selection.node().getBoundingClientRect();
  //     selection.transition(trans)
  //       .attr('x', () => {
  //         if (d.x === (width / 2)) return d.x;
  //         else if (d.x > (width / 2)) return d.x + (labelArea.width * 0.85);
  //         else if (d.x < (width / 2)) return d.x - (labelArea.width * 0.85);
  //       })
  //       .attr('y', d.y)
  //       .attr('dy', () => {
  //         if (d.x === (width / 2)) return '-.35em';
  //         else return '.35em';
  //       });
  //   });
  // }

  let __appendSeries = function(selection) {
    let series = selection.selectAll(that.seriesName(true))
      .data(d => [d]);
    series.exit().remove();
    series = series.enter().append('g')
      .attr('class', that.seriesName(true))
      .call(__local);

    let pathArea = series.selectAll(className('area', true))
      .data(d => [d]);
    pathArea.exit().remove();
    pathArea.enter().append('polygon')
      .attr('class', className('area'))
      .call(__pathAreaInit)
      .merge(pathArea)
      .call(__pathArea);
  };

  let __appendPoints = function(selection) {
    let point = selection.selectAll(that.nodeName())
      .data(d => d.children);
    point.exit().remove();
    let pointEnter = point.enter().append('g')
      .attr('class', that.nodeName(true));
    pointEnter.append('circle')
      .call(__pointInit);
    // pointEnter.append('text')
    //   .call(__labelInit);
    point = pointEnter.merge(point);
    point.select('circle')
      .call(__point);
    // point.select('text')
    //   .call(__label);
  };

  let __appendDummyPoints = function(selection) {
    let dummyPoint = selection.selectAll(className('dummy-point', true))
      .data(d => {
        let dataArr = [];
        d.forEach(function(data){
          let target = data.children;
          target.forEach(function(t) {
            dataArr.push(t);
          });
        });
        return dataArr;
      });
    dummyPoint.exit().remove();
    // let translate = (innerSize.width - width) / 2 + ', ' + (innerSize.height - height) / 2;
    let wTranslate = (innerSize.width - width) / 2;
    let hTranslate = 0;
    if (legend && legend.orient === 'top') {
      hTranslate = (innerSize.height - height) / 2 + (legend.thickness / 2);
    } else {
      hTranslate = (innerSize.height - height) / 2
    }
    let translate = wTranslate + ', ' + hTranslate;
    let dummyPointEnter = dummyPoint.enter().append('g')
      .attr('class', that.nodeName(true))
      .attr('transform', 'translate(' + translate + ')')
    dummyPointEnter.insert('circle')
      .call(__dummyPoint);
  };

  let region = canvas.selectAll(this.regionName());
  region.call(__appendSeries);
  region.call(__appendPoints);

  canvas
    .insert('g')
    .attr('class', className('dummy-point'))
    .call(__appendDummyPoints);
}

export default _mark;