import RectLinear from '../rectLinear';
import axisFacet from './axisFacet';
import facet from './facet';

const _attrs = {
  facet: false
}
/**
 * adds Facet features to RectLinear
 * @class Facet
 * @augments RectLinear
 */
class Facet extends RectLinear {
  constructor() {
    super();
    this.setAttrs(_attrs);
  }
}
Facet.prototype.axisFacet = axisFacet;
Facet.prototype.facet = facet;

export default Facet;