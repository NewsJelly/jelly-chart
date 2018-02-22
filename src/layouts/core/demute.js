import {duration} from './mute';

/**
 * recovers the selection's opacity from {@link Core#mute}
 * @memberOf Core#
 * @param {d3Selection} nodeOrRegion the selection of nodes and regions in the chart
 * @return {Core}
 */
function demute(nodeOrRegion) {
  nodeOrRegion.transition().duration(duration).attr('opacity', 1);
  return this;
}

export default demute;