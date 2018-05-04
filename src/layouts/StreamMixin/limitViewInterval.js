import timeInterval from '../../modules/interval';

function limitViewInterval(scale, domain, isKeep=false) {
  const viewInterval = this.viewInterval() || domain.length;
  const intervalType = typeof viewInterval;
  scale._defaultDomain = domain;
  if (isKeep) scale._lastDomain = scale.domain();
  if (scale.invert) {
    if (intervalType === 'string' && domain[0] instanceof Date) {
      if (isKeep) {
        domain = [
          timeInterval[viewInterval].offset(domain[domain.length-1], -1), 
          domain[domain.length-1]
        ];
      } else {
        domain = [
          domain[0], 
          timeInterval[viewInterval].offset(domain[0], 1)
        ];
      }
    } else if (intervalType === 'number') {
      if (isKeep) {
        domain = [domain[domain.length-1] - viewInterval, domain[domain.length-1]];
      } else {
        domain = [domain[0], domain[0] + viewInterval];
      }
    }
  } else {
    if (intervalType === 'number') {
      if (isKeep) {
        const dist = domain.length - viewInterval;
        domain = domain.slice(dist, dist + viewInterval);
      } else {
        domain =  domain.slice(0,viewInterval);
      }
    }
  }
  return domain;
}

export default limitViewInterval;