const duration = 140;
/**
 * transparentize the selection's opacity by {@link Core#muteIntensity}
 * @memberOf Core#
 * @param {d3Selection} nodeOrRegion the selection of nodes and regions in the chart
 * @param {number} [intensity]
 * @return {Core}
 */
function mute(nodeOrRegion, intensity) {
  intensity = intensity || this.muteIntensity();
  nodeOrRegion.transition().duration(duration).attr('opacity', intensity);
  return this;
}

export default mute;
export {duration};