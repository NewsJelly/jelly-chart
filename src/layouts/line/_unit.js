import {select, transition} from 'd3';

function translate(selection, innerSize, pos) {
    selection.attr("transform", "translate(" + [innerSize.width + pos[0], -20 + pos[1]] + ")")
}
function _unit() {
    const unit = this.unit();
    const canvas = this.__execs__.canvas;
    const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
    const innerSize = this.innerSize();
    if (canvas.select(".unit-text").empty()){
        canvas.append("text").attr("class", "unit-text");
    }
    const unit_text = canvas.select(".unit-text");
    unit_text.text(unit ? (unit['text'] ? unit['text'] : unit) : "")
        .style("font-family", "Noto Sans KR")
        .style("font-size", "22px")
        .style("font-weight", "600")
        .style("fill", "#C6CBCE")
        .attr("text-anchor", "end")
        .call(translate, innerSize, unit ? (unit['pos'] ? unit['pos'] : [0,0]) : [0,0])
}
export default _unit;
