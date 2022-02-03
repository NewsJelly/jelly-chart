/**
 * If zoom is string, selects a zoom type. If zoom is true, use the normal zoom type. If zoom is not specified, renders the current zoom Setting.
 * @memberOf ZoomMixin#
 * @function
 * @example
 * zoomMixin.zoom(true) // selects normal zoom type
 * zoomMixin.zoom(false) // disable the zoom feature.
 * zoomMixin.zoom('brush') // selects brushable zoom type.
 * @param {boolean|string} [zoom=false] 
 * @return {zoom|ZoomMixin}
 */
function zoom(zoom) {
  const types = ['normal', 'brush'];
  if (!arguments.length) return this.__attrs__.zoom;
  if (typeof zoom === 'boolean') {
    if (zoom) this.__attrs__.zoom = 'normal';
    else this.__attrs__.zoom = false;
  } else if (typeof zoom === 'string') {
    if (types.findIndex(d => d.localeCompare(zoom) === 0) >= 0) {
      this.__attrs__.zoom = zoom;
    }
  } 
  return this;
}

export default zoom;