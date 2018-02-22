import conditionForMute from './_condtionForMute';

export default function (exceptionFilter) {
  let nodes;
  if (!arguments.length) { 
    nodes = this.filterNodes().classed('mute', true).call(this.mute, this.muteIntensity());
  } else if (exceptionFilter === null) { 
    nodes = this.filterNodes().classed('mute', false).call(this.demute);
  } else {
    nodes = this.filterNodes(conditionForMute(exceptionFilter));
    if (nodes.size() > 0) {
      nodes.classed('mute', true).call(this.mute, this.muteIntensity());
    }
  }
  return this;
}