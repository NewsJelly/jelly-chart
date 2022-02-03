import {select, transition} from 'd3';

function translate(selection, innerSize, pos) {
    selection.attr("transform", "translate(" + [pos[0]-85, pos[1]-20] + ")")
}

function _title() {
    const title = this.title();
    const canvas = this.__execs__.canvas;
    const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
    const innerSize = this.innerSize();
    if (canvas.select(".title_text").empty()) {
        canvas.append("text").attr("class", "title_text");
    }
    const title_text = canvas.select(".title_text");
    title_text.text(title ? (title['text'] ? title['text'] : title) : "")
        .style("font-family", "Noto Sans KR")
        .style("font-size", "40px")
        .style("font-weight", "bold")
        .style("fill", "#FFFFFF")
        .attr("text-anchor", "start")
        .call(translate, innerSize, title ? (title['pos'] ? title['pos'] : [0,0]) : [0,0])
}

export default _title;
