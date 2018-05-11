import timeInterval from '../../modules/interval';

function limitViewInterval(scale, domain, isKeep=false) {
  const viewInterval = this.viewInterval();
  const intervalUnit = viewInterval ? viewInterval.unit : domain.length;
  const intervalMultiple = viewInterval ? viewInterval.multiple : 1;
  const intervalType = typeof intervalUnit;
  scale._defaultDomain = domain;
  if (isKeep) scale._lastDomain = scale.domain();
  if (scale.invert) {
    if (intervalType === 'string' && domain[0] instanceof Date) {
      if (isKeep) {
        domain = [
          timeInterval[intervalUnit].offset(domain[domain.length-1], -1 * intervalMultiple), 
          domain[domain.length-1]
        ];
      } else {
        domain = [
          domain[0], 
          timeInterval[intervalUnit].offset(domain[0], 1 * intervalMultiple)
        ];
      }
    } else if (intervalType === 'number') {
      if (isKeep) {
        domain = [domain[domain.length-1] - intervalUnit * intervalMultiple, domain[domain.length-1]];
      } else {
        domain = [domain[0], domain[0] + intervalUnit * intervalMultiple];
      }
    }
  } else {
    if (intervalType === 'number') {
      if (isKeep) {
        const dist = domain.length - intervalUnit* intervalMultiple;
        domain = domain.slice(dist, dist + intervalUnit * intervalMultiple);
      } else {
        domain =  domain.slice(0,intervalUnit * intervalMultiple);
      }
    }
  }
  return domain;
}

export default limitViewInterval;