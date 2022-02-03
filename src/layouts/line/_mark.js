import {
    timeFormat,
    area,
    curveCatmullRom,
    curveLinear,
    curveStep,
    line,
    max,
    select,
    transition
} from 'd3';
import {
    curves
} from '../seriesMixin'
import {
    shapes
} from './';
import {
    className,
    labelFormat
} from '../../modules/util';

function _mark(zoomed = false) {
    const that = this;
    const canvas = this.__execs__.canvas;
    const field = this.__execs__.field;
    const nested = this.isNested.call(this);
    const scale = this.__execs__.scale;
    const stacked = this.isStacked();
    const color = this.color();
    const label = this.label();
    const individualScale = this.isIndividualScale();
    const size = this.size();
    const showPoint = this.point();
    const pointRatio = this.pointRatio();
    const trans = zoomed ? transition().duration(0).delay(0) : transition().duration(this.transition().duration).delay(this.transition().delay);
    const isArea = this.shape() === shapes[1];
    const areaGradient = isArea && this.areaGradient();
    const yField = this.measureName();
    const curve = this.curve() === curves[0] ? curveLinear : (this.curve() === curves[1] ? curveStep : curveCatmullRom);
    const scaleBandMode = this.scaleBandMode();
    const multiTooltip = this.multiTooltip();
    const stream = this.stream();
    const diffWithArrow = this.diffWithArrow();
    const downArrow = this.downArrowPath();
    const upArrow = this.upArrowPath();
    const font = this.font();
    const xKey = d => field.x.interval() ? new Date(d.data.key) : d.data.key;
    const xValue = d => scale.x(xKey(d)) + (scaleBandMode ? scale.x.bandwidth() / 2 : 0);
    const yValueFunc = (s) => {
        return d => {
            return stacked ? s(d.data.value[yField + '-end']) : s(d.data.value[yField])
        }
    }
    const lineInitGen = line().x(xValue).y(max(scale.y.range())).curve(curve);
    const lineGenFunc = (ys) => {
        return line().x(xValue).y(yValueFunc(ys)).curve(curve);
    }
    const areaInitGen = area().x(xValue)
        .y(max(scale.y.range())).curve(curve);
    const areaGenFunc = (ys) => {
        return area().x(xValue)
            .y0(d => stacked ? scale.y(d.data.value[yField + '-start']) : max(scale.y.range()))
            .y1(yValueFunc(ys)).curve(curve);
    }
    let __local = function(selection) {
        let tFormat = (key) => {
            let f = field.x.isInterval() ? timeFormat(field.x.format()) : null;
            return f ? f(key) : key;
        }

        selection.each(function(d, i, arr) {
            d.value = stacked ? d.data.value[yField + '-end'] : d.data.value[yField];
            d.x = xValue(d);
            if (isNaN(d.x) && scale.x._defaultDomain) {
                d.x = that.tempPosForOrdinalScale(xKey(d), scale.x);
            }
            if (stream) {
                const curX = xKey(d);
                if (scale.x.invert) {
                    const dist = that.distDomain(scale.x);
                    if (curX > scale.x._lastDomain[scale.x._lastDomain.length - 1]) {
                        d.x0 = d.x + dist;
                    }
                } else {
                    d.x0 = that.tempPosForOrdinalScale(xKey(d), scale.x);
                }
            }
            d.y = yValueFunc(individualScale ? d.parent.scale : scale.y)(d);
            d.anchor = i === 0 ? 'start' : (i === arr.length - 1 ? 'end' : 'middle');
            d.text = labelFormat(d.value);
            d.color = d.parent.color;
            d.key = tFormat(d.data.key);
        })
    }

    let __upward = function(selection) {
        selection.each(function(d, i, arr) {
            let upward = true;
            //let result = mark.get(this);
            if (i < arr.length - 1 && arr[i + 1]) {
                let nextResult = arr[i + 1];
                upward = (nextResult.y <= d.y);
            }
            d.upward = upward;
        });
    }

    let __seriesInit = function(selection, area = false) {
        if (area) {
            selection.each(function(d) {
                let target = d.children;
                select(this).attr('d', areaInitGen(target)).attr('fill-opacity', 0.4)
                    .style('stroke', 'none');
            })
        } else {
            selection.each(function(d) {
                let target = d.children;
                select(this).attr('d', lineInitGen(target))
                    .style('fill', 'none');
                let values = target.map(function(d) {
                    return d.value
                });
                d.diff = values[values.length - 1] - values[values.length - 2];
                d.y = yValueFunc(scale.y)(d.children[d.children.length - 1]);
                d.x = xValue(d.children[d.children.length - 1]);
            })
        }
    }
    let __series = function(selection, area = false, stream = false) {
        const c = d => nested ? scale.color(d.data.key) : color[0];
        const dist = stream && that.distDomain(scale.x);
        selection.each(function(d) {
            let target = d.children;
            let thisSelect = select(this);
            if (stream) {
                thisSelect
                    .attr('d', (area ? areaGenFunc : lineGenFunc)(individualScale ? d.scale : scale.y)(target))
                    .attr('transform', `translate(${dist},0)`)
                    .transition(trans)
                    .attr('transform', `translate(0,0)`)
            } else {
                thisSelect.transition(trans)
                    .attr('d', (area ? areaGenFunc : lineGenFunc)(individualScale ? d.scale : scale.y)(target));
            }

        })
        if (area) {
            selection
                .attr('fill', c).attr('stroke', 'none')
        } else {
            if (areaGradient) {
                let url = d => `url(#areaGradient-${d.data.key})`
                selection
                    .attr('stroke', 'none')
                    .attr("fill", url);
                // console.log('c', c)
            } else if (area) {
                selection.attr('fill', c)
            } else {
                selection.attr('stroke', c)
                    .attr('stroke-width', size.range[0] + 'px')
            }
        }
    }
    let __pointInit = function(selection) {
        selection
            .attr('r', (size.range[0] - size.range[0] / 4) * pointRatio)
            .attr('stroke-width', size.range[0] / 4 * pointRatio)
            // .style('fill', '#fff')
            .attr('opacity', showPoint ? 1 : 0)
            .style('cursor', 'pointer')
            .attr('cx', d => d.x0 || d.x)
            .attr('cy', d => stream ? d.y : max(scale.y.range()))
    }
    let __point = function(selection) {
        selection
            .transition(trans)
            .attr('r', (size.range[0] - size.range[0] / 4) * pointRatio)
            .attr('stroke-width', size.range[0] / 4 * pointRatio)
            .attr('opacity', showPoint ? 1 : 0)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    }
    let __labelInit = function(selection) {
        selection.each(function(d) {
            let selection = select(this);
            selection.attr('x', d => d.x0 || d.x)
                .attr('y', d => stream ? d.y : max(scale.y.range()))
                .attr('stroke', 'none')
                .style("fiil", "#ffffff")
                .style('visibility', label ? 'visible' : 'hidden')
                .text(d.text)
            that.styleFont(selection);
        })
    }
    let __label = function(selection) {
        selection.each(function(d) {
            let selection = select(this);
            if (diffWithArrow) {
                if (d.anchor == "end") {
                    d.anchor = "start";
                    d.x += 15;
                    d.text += "  " + d.parent.data.key
                } else if (d.anchor == "start") {
                    d.anchor = "end";
                    d.x -= 15
                }
            }
            selection.attr('text-anchor', d.anchor)
                .style('pointer-events', multiTooltip ? 'none' : 'all')
                .transition(trans)
                // .attr('y', d.y  + (size.range[0] / 2 * pointRatio + 1) * (d.upward ? 1 : -1))
                .attr('y', d.y + font["font-size"] * .75 / 2)
                .attr('x', d.x)
                // .attr('dy', d.upward ? '.71em' : 0)
                .style('visibility', label ? 'visible' : 'hidden')
                .text(d.text);
            that.styleFont(selection);
        })
    }

    let __appendSeries = function(selection) {
        let series = selection.select(that.seriesName());
        if (series.empty()) {
            series = selection.append('g').attr('class', that.seriesName(true));
        }
        let ___append = function(selection, area) {
            let path = selection.selectAll('path' + className((area ? 'area' : 'line'), true))
                .data(d => [d], (d, i) => d.data ? d.data.key : i)
            path.exit().remove();
            path.enter().append('path')
                .attr('class', className((area ? 'area' : 'line')))
                .call(__seriesInit, area)
                .merge(path)
                .call(__series, area, stream)
                .style('pointer-events', 'none');
        }
        if (isArea) {
            series.call(___append, true);
        } else { // remove area
            series.selectAll('path' + className('area', true)).remove();
        }
        series.call(___append, false);
    }

    let __appendPoints = function(selection) {
        selection.attr('fill', d => d.color)
            .attr('stroke', d => d.color);
        let point = selection.selectAll(that.nodeName())
            .data(d => d.children, d => d.data.key)
        point.exit().remove();
        let pointEnter = point.enter().append('g')
            .attr('class', that.nodeName(true))
            .call(__local);
        pointEnter.append('circle')
            .call(__pointInit);
        pointEnter.append('text')
            .call(__labelInit);
        point.call(__local);
        point = pointEnter.merge(point)
            .call(__upward);
        point.select('circle')
            .call(__point);
        point.select('text')
            .call(__label)
    }

    let __appendArrow = function(selection) {
        var arrow = selection.select(that.seriesName(true) + "arrow");
        if (arrow.empty()) {
            arrow = selection.append("g").attr("class", that.seriesName(true) + "arrow")
        }
        arrow.append("svg:image").attr("class", className("markarrow"));
        arrow.append("text").attr("class", className("markarrow"));
        var series = selection.select(that.seriesName());
        var diff = {};
        series.each(function(d, e, i) {
            diff = {
                value: d.diff,
                x: d.x + 125,
                y: d.y - 10,
                h: 20,
                w: 20,
                text: labelFormat(d.diff, true)
            }
        });
        // var o = select(this);
        arrow.select("image" + className("markarrow", true))
            .datum(diff)
            .attr("x", diff.x)
            .attr("y", diff.y)
            .attr("height", diff.h)
            .attr("width", diff.w)
            .attr("xlink:href", diff.value < 0 ? downArrow : upArrow);
        arrow.select("text" + className("markarrow", true))
            .datum(diff)
            .attr("x", diff.x + 25)
            .attr("y", diff.y + 15)
            .attr("height", diff.h)
            .attr("width", diff.w)
            .text(diff.text)
    };

    let region = canvas.selectAll(this.regionName());
    region.each(function() {
        select(this).each(function(d) {
                d.children.sort((a, b) => xValue(a) - xValue(b));
            }).call(__appendSeries)
            .call(__appendPoints);
    });
    if (diffWithArrow) {
        region.each(function() {
            select(this).each(function(d) {
                d.children.sort((a, b) => xValue(a) - xValue(b));
            }).call(__appendArrow);
        });
    }
}

export default _mark;
