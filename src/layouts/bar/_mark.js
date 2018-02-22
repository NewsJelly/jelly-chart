import {local, select, timeFormat, transition} from 'd3';
import {className, labelFormat, zeroPoint} from '../../modules/util';
function _mark() {
  const that = this;
  const canvas = this.__execs__.canvas;
  const nested = this.isNested.call(this);
  const scale = this.__execs__.scale;
  const stacked = this.stacked();
  const vertical = this.isVertical();
  const color = this.color();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay)
  const yField = this.measureName();
  const hasZeroPoint = zeroPoint(scale.y.domain());
  const label = this.label();
  const field = this.__execs__.field;
  const diffColor = this.showDiff();
  const isShowDiff = !nested && diffColor;
  
  let __local = function (selection, monoColor = false) {
    let _fill = d => {
      if(monoColor) return color[0];
      else return scale.color(d.data.key);
    }
    let tFormat = (key) => {
      let f = field.x.interval() && field.x.format() ? timeFormat(field.x.format()) : null; 
      return f ? f(key) : key;
    }
    selection.each(function(d) { //local에 저장
      let x,y,w,h;
      let yValue = d.value//d.data.value[yField];
      let upward = yValue >=0;
      if (stacked) {
        x = 0;
        y = (vertical ? upward: !upward) ? scale.y(d.data.value[yField + '-end']) : scale.y(d.data.value[yField + '-start']);
        w = nested ? scale.region.bandwidth() : scale.x.width;
        h = Math.abs(scale.y(d.data.value[yField + '-start']  ) - scale.y(d.data.value[yField + '-end']));
      } else {
        x =  scale.x(d.data.key);
        y =  (vertical ? upward: !upward) ? scale.y(yValue) : (hasZeroPoint ? scale.y(0) : scale.y.range()[0]);
        w = scale.x.bandwidth();
        h = Math.abs((hasZeroPoint ?  scale.y(0): scale.y.range()[0]) - scale.y(yValue));
      }
      let result = vertical ? {x,y : y + (upward ? 0 : 0.5),w,h,upward} : {x:y + (upward ? 0.5 : 0), y:x, w:h, h: w,upward};
      result.key = tFormat(d.data.key);
      result.color = _fill(d);
      result.text = labelFormat(yValue);
      //result.value = yValue;
      for (let k in result) {
        if (result.hasOwnProperty(k)) d[k] = result[k];
      }
    });
  }
  let __barInit = function(selection, vertical=true) {
    selection.each(function(d) {
      let selection = select(this);
      selection.style('cursor', 'pointer')
        .style('fill', function(d) {
          if (select(this).classed(className('diff'))) return 'none';
          else return d.color;
        }); 
      if(vertical) {
        selection.attr('x', d.x)
          .attr('y', d.upward ? d.y + d.h : d.y)
          .attr('width', d.w )
          .attr('height', 0);
      } else {
        selection.attr('x', d.upward ? d.x : d.x + d.w)
          .attr('y', d.y)
          .attr('width', 0)
          .attr('height', d.h);
      }
    })
  }
  let __labelInit = function (selection, vertical=true) {
    selection.each(function(d) {
      let selection = select(this);
      selection.style('pointer-events', 'none').text(d.text);
      if (vertical) {
        selection.attr('x', d.x + d.w/2).style('text-anchor', 'middle')
        if (stacked) selection.attr('y', d.y + d.h).attr('dy', '1em');
        else if(d.upward) selection.attr('y', d.y + d.h).attr('dy', '-.25em');
        else selection.attr('y', d.y).attr('dy', '1em');
      } else {
        selection.attr('y', d.y + d.h/2).attr('dy', '.35em');
        if (stacked) selection.attr('x', d.x + d.w/2).attr('text-anchor', 'middle');
        else if(d.upward) selection.attr('x', d.x).attr('dx', '.5em');
        else selection.attr('x', d.x + d.w).attr('text-anchor', 'end').attr('dx', '-.1em')
      }
      that.styleFont(selection);
    })
  }
  let __bar = function(selection) {
    selection.transition(trans).attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.w)
      .attr('height',d => d.h) 
      .style('fill', function(d) {
        if (select(this).classed(className('diff'))) return 'none'
        else return d.color;
      }); 
  }
  let __label = function(selection, vertical=true) {
    selection.each(function(d) {
      let selection = select(this);
      if (vertical) {
        selection.transition(trans).attr('y', d.upward ? d.y : d.y + d.h);
      } else {
        if (stacked) selection.transition(trans).attr('x', d.x + d.w/2).attr('text-anchor', 'middle');        
        else selection.transition(trans).attr('x', d.upward ? d.x + d.w : d.x);
      }
      selection.text(d.text)
        .style('fill', stacked ? '#fff' : d.color)
        .style('visibility', label && (!diffColor || (diffColor && selection.classed(className('diff')))) ? 'visible' : 'hidden');
    })
  }
 
  let bar;
  let region = canvas.selectAll(this.regionName());
  bar = region
    .selectAll(this.nodeName()) 
    .data(d => {
      let target = d.children;
      return stacked ? target.slice().reverse() : target;
    }, d => d.data.key);
  bar.exit().remove();
  let barEnter = bar.enter().append('g')
    .attr('class', this.nodeName(true))
    .call(__local, nested ? false : this.mono()); 
  barEnter.append('rect')
    .attr('class', className('bar'))
    .call(__barInit, vertical); 
  barEnter.append('text')
    .attr('class', className('bar'))
    .call(__labelInit, vertical);
  if (nested && stacked) {
    barEnter.append('path')
      .style('fill', d => d.color)
      .style('visibility', 'hidden')
      .attr('opacity', '0.5')
  }
  bar.call(__local, nested ? false : this.mono());    
  bar = barEnter.merge(bar);
  bar.select('rect' + className('bar', true)).call(__bar, vertical);
  bar.select('text' + className('bar', true)).call(__label, vertical);

  if (isShowDiff) { 
    let last;
    let strokeWidth = 1;
    let halfStrokeWidth = strokeWidth /2;
    barEnter.append('rect')
      .attr('class', className('diff'))
      .attr('stroke-dasharray', '5, 3')
      .attr('stroke-width', strokeWidth);
    barEnter.append('text')
      .attr('class', className('diff'));
    bar.each(function(d,i,arr) {
      if (i > 0) {
        d.neighbor = last;
        let diff = {value: d.value - last.value, upward: d.upward};
        if (vertical) {
          diff.x = d.x; diff.w = d.w; 
          if (diff.value > 0) {
            diff.y = d.y;
            diff.h = last.y - d.y;
          } else {
            diff.y = last.y;
            diff.h = d.y - last.y;
          }
        } else {
          diff.y = d.y; diff.h = d.h;
          if (diff.value > 0) {
            diff.x = last.w;
            diff.w = d.w - last.w;
          } else {
            diff.x = d.w;
            diff.w = last.w - d.w;
          }
        }
        diff.x += halfStrokeWidth; diff.y += halfStrokeWidth;
        diff.h -= strokeWidth; diff.w -= strokeWidth;
        diff.w = Math.max(strokeWidth*2, diff.w);
        diff.h = Math.max(strokeWidth*2, diff.h);
        diff.text = labelFormat(diff.value, true);
        select(this).select('text' + className('bar', true))
          .each(function(d) {
            let selection = select(this).transition(trans);
            if (diff.value < 0) {
              if (vertical) {
                selection.attr('y', (d.upward ? d.y : d.y + d.h) - diff.h);
              } else {
                selection.attr('x', (d.upward ? d.x + d.w : d.x) + diff.w);
              }
            }  
          });
        select(this).select('rect' +  className('bar', true))
          .transition(trans)
          .style('fill', d => d.color = diffColor[(diff.value > 0 ? 'inc': 'dec') + 'Fill']);
        select(this).select('rect'+ className('diff', true))
          .datum(diff)
          .attr('x', vertical? diff.x+halfStrokeWidth : 0)
          .attr('y', vertical? (d.upward ? d.y + d.h : d.y): diff.y + halfStrokeWidth)
          .attr('width', vertical? d.w - strokeWidth : 0)
          .attr('height', vertical? 0 : d.h -strokeWidth)
          .call(__bar)
          .style('stroke', diffColor[(diff.value > 0 ? 'inc': 'dec') + 'Stroke']);
        select(this).select('text' +  className('diff', true))
          .datum(diff)
          .call(__labelInit, vertical)
          .call(__label, vertical)
          .style('fill', diffColor[(diff.value > 0 ? 'inc': 'dec') + 'Fill']);
        d.diff = diff;
      } else {
        d.neighbor = select(arr[i+1]).datum();
        select(this).select('rect' + className('bar', true))
          .transition(trans).style(diffColor.neuFill);
        select(this).select('rect' + className('diff', true)).remove();
      }
      last = d;
    })
  }

  if (nested && stacked) { //show diff of stacked
    let pathLocal = local();
    region.each(function(r,i,arr) {
      let neighbor = select(i < arr.length-1 ? arr[i+1] : arr[i-1]).datum();
      let nds = neighbor.children;
      select(this).selectAll(that.nodeName())
        .each(function(d) {
          let nd = nds.find(nd => nd.data.key === d.data.key);
          d.neighbor = nd; //save neighbor data
        });
    });
    region.filter((d,i,arr) =>  i < arr.length-1)
      .selectAll(that.nodeName()).select('path')
      .style('fill', d => d.color)
      .each(function(d) {
        d.diff = {value: d.neighbor.value - d.value};
        let parent = d.parent;
        let neighbor = d.neighbor;
        let neighborParent = neighbor.parent;
        let points = [];
        if (vertical) { //push in clockwise order
          points.push([d.x + d.w , d.y]);
          points.push([neighborParent.x + neighbor.x - parent.x, neighborParent.y - parent.y + neighbor.y]);
          points.push([points[1][0], points[1][1] + neighbor.h]);
          points.push([points[0][0], points[0][1] + d.h]);
        } else { 
          points.push([d.x, d.y + d.h]);
          points.push([points[0][0] + d.w, points[0][1]]);
          points.push([neighborParent.x + neighbor.x + neighbor.w - parent.x , points[0][1] + neighborParent.y + neighbor.y - parent.y - d.y - d.h]);
          points.push([points[2][0] - neighbor.w, points[2][1]]);
        }
        let source = (vertical ? [points[0], points[3]] : [points[0], points[1]])
        source =  'M' + source[0] + 'L' + (vertical? source[0] : source[1]) + 'L' + source[1] + 'L' + (vertical? source[1] : source[0])  + 'z';
        let target = points.map((point,i) => (i === 0 ? 'M' : 'L') + point).join('') + 'z';
        pathLocal.set(this, {source, target});  
      });
  
    bar.on('mouseenter.stacked',function(d) {
      bar.filter(t => t.data.key !== d.data.key)
        .selectAll('rect' + className('bar', true))
        .transition()
        .style('fill', '#b2c0d1');
      let neighbor = region.selectAll(that.nodeName()).filter(t => t.data.key === d.data.key);
      if (!label) {
        select(this).select('text' + className('bar', true)).style('visibility', 'visible');
        neighbor.select('text' + className('bar', true)).style('visibility', 'visible');
      }
      neighbor.select('path').style('visibility', 'visible')
        .attr('d', function() { 
          let path = pathLocal.get(this);
          if (path) return path.source;
        })
        .interrupt()
        .transition(trans)
        .attr('d', function() { 
          let path = pathLocal.get(this);
          if (path) return path.target;
        })
    }).on('mouseleave.stacked',function(d) {
      bar.filter(t => t.data.key !== d.data.key)
        .selectAll('rect' + className('bar', true))
        .transition()
        .style('fill', d => d.color);
      let neighbor = region.selectAll(that.nodeName()).filter(t => t.data.key === d.data.key);
      if (!label) {
        select(this).select('text' + className('bar', true)).style('visibility', 'hidden');
        neighbor.select('text' + className('bar', true)).style('visibility', 'hidden');        
      }
      neighbor.select('path')
        .interrupt()
        .transition(trans)
        .attr('d', function() { 
          let path = pathLocal.get(this);
          if (path) return path.source;
        }).on('end', function(){
          select(this).style('visibility', 'hidden');
        })
    })
  }
}

export default _mark;