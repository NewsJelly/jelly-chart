function bindOn(node, dispatch) {
  node.on('click.default', function () {
    dispatch.apply('selectClick', this, arguments);
  }).on('mouseenter.default', function () {
    dispatch.apply('selectEnter', this, arguments);
  }).on('mouseleave.default', function () {
    dispatch.apply('selectLeave', this, arguments);
  })
  return node;
}
function run(process) {
  process.forEach(p => {
    if (p.allow) {
      if (p.allow.call(this)) p.call.call(this);
    } else {
      p.call.call(this);
    }
  })
}
/**
 * renders the chart. At the end of settings for a chart, it should be called. If keep is true, it does not reset existing scales.
 * @memberOf Core#
 * @function
 * @param {boolean} [keep=false] If is true, not reset existing scales.
 * @param {String[]} [skip=[]] If skip includes an process, the process will be ignored.
 * @return {Core}
 */
function render(keep = false, skip = []) {
  const process = {
    pre: [],
    post: []
  };
  this.process().forEach(p => {
    if (skip.indexOf(p.type) < 0) {
      if (p.isPre) process.pre.push(p);
      else process.post.push(p);
    }
  })

  this.reset(keep);
  this.keep(keep);
  if (this.needCanvas()) this.renderFrame();
  run.call(this, process.pre);
  if (this.needCanvas()) this.renderCanvas();
  run.call(this, process.post);

  if (!this.__execs__.canvas) return;

  const dispatch = this.__execs__.selectDispatch;
  const node = this.nodes();
  const legend = this.__execs__.legend;
  if (node && node.size() > 0) {
    if (this.parent()) {
      return;
    }
    node.call(bindOn, dispatch)
      .on('mouseenter.default.legend', (d) => {
        if (legend && legend.mute && this.muteToLegend) this.muteToLegend(d);
      }).on('mouseleave.default.legend', (d) => {
        if (legend && legend.demute && this.demuteToLegend) this.demuteToLegend(d);
      })
  }

  if (this.isFacet && this.isFacet()) { //when is facet, get dispatch from regions.
    node.call(bindOn, dispatch);
  }

  return this;
}

export default render;