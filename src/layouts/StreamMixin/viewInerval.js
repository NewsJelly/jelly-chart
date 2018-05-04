import interval from '../../modules/interval';

function viewInterval(viewInterval) {  
  if (!arguments.length) return this.__execs__.viewInterval;
  const type = typeof viewInterval;
  if (type === 'number') {
    if (viewInterval <= 0) viewInterval = null;
  } else if (type === 'string') { //d3-time interval
    if (!Object.keys(interval).includes(viewInterval)) {
      viewInterval = null;
    }
  }
  this.__execs__.viewInterval = viewInterval;
  return this;
}

export default viewInterval;