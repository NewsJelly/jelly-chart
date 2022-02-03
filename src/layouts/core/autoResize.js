const allowThreshold = 20;
/**
 * @memberOf Core#
 * If autoResize is true, it will ignore current width setting and change the chart's width according to the containers's width. If autoResize is not specified, returns the current autoResize setting. 
 * @return {autoResize|Core}
 * @param {boolean} [autoResize=false] If is true, resizes the chart's width according to the containers's width
 * @return {autoResize|Core}
 */
function autoResize(autoResize) {
  if (!arguments.length) return this.__attrs__.autoResize;
  if (autoResize) {
    if (!this.__execs__.autoResize) {
      const that = this;
      let allowResize = true; 
      let lastWidth;
      this.__execs__.autoResize = function() {
        if (allowResize && that.__execs__.canvas) {
          const rect = that.__execs__.container.node().getBoundingClientRect();
          if ((!lastWidth || lastWidth !== rect.width))  {
            const transition = that.transition();
            that.width(rect.width)
              .transition({duration: 0, delay:0})
              .render(true, that.autoResizeSkip())
              .transition(transition);
            lastWidth = rect.width;
          }
          allowResize = false;
          setTimeout(() => {
            allowResize = true;
          }, allowThreshold);
        }
      }
    }
    window.addEventListener('resize', this.__execs__.autoResize);
  } else {
    if (this.__execs__autoResize) {
      window.removeEventListener('resize', this.__execs__.autoResize);
      this.__execs__.autoResize = null;
    }
  }
  this.__attrs__.autoResize = autoResize;
  return this;
}

export default autoResize;