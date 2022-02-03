import conditionForMute from './_condtionForMute';

function mute(regions, ismute = true, isSeries = false) {
  regions.selectAll(isSeries ? this.seriesName() : this.nodeName()).classed('mute', ismute).call(ismute ? this.mute : this.demute, this.muteIntensity());
}

function muteRegions(exceptionFilter) {
  let regions;
  if (!arguments.length) {  
    regions = this.filterRegions();
    mute.call(this, regions, true);
    if (this.seriesName) mute.call(this, regions, true, true);
  } else if (exceptionFilter === null) { 
    regions = this.filterRegions();
    mute.call(this, regions, false);
    if (this.seriesName) mute.call(this, regions, false, true);
  } else {
    regions = this.filterRegions(conditionForMute(exceptionFilter), true);
    if (regions.size() > 0) {
      mute.call(this, regions, true);
      if (this.seriesName) mute.call(this, regions, true, true);
    }
  } 
  return this;
}

export default muteRegions;