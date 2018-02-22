/**
 * returns all nodes
 * @memberOf Core#
 * @function
 * @return {d3Selection} nodes
 */
function nodes() {
 return this.regions().selectAll(this.nodeName());
}

export default nodes;