/**
 * sets axes of facet area
 * @memberOf Facet#
 * @function
 * @private
 * 
 */
function axisFacet(useRegion = true) {
  const facet = this.facet();
  const field = this.__execs__.field;
  const xAt = this.axisX();
  const yAt = this.axisY();
  const scale = this.__execs__.scale;
  const innerSize = this.innerSize();
  //horizontal => top d1
  //vertical => right d1
  if (facet.orient === 'horizontal' && xAt) {
    field[useRegion ? 'region' : 'x'].axis(xAt);
    xAt.orient = 'top';
    xAt.showDomain = false;
    this.axisDefault(scale.region, xAt);
  } else if (facet.orient === 'vertical' && yAt) {
    field[useRegion ? 'region' : 'x'].axis(yAt);
    yAt.orient = 'right';
    yAt.showDomain = false;
    this.axisDefault(scale.region, yAt).x(innerSize.width);
  }
  
  return this;
}

export default axisFacet;