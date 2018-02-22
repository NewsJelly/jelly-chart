import {select} from 'd3';
function _map (selection) {
  selection = select(selection);
  let frame = selection.select('.frame.layer');
  if (frame.empty()) {
    frame = selection.append('div')
      .attr('class', 'frame layer');
  }
  frame.style('width', this.width() + 'px')
    .style('height', this.height()  + 'px');
  const options = {
      center: new daum.maps.LatLng(33.450701, 126.570667),
      level: 3
    }; // defaut zoom option
  let map = new daum.maps.Map(frame.node(), options);
  map.setMapTypeId(daum.maps.MapTypeId[this.mapBaseType()]);
  if (this.overlayMapType()) map.addOverlayMapTypeId(daum.maps.MapTypeId[this.overlayMapType()]);
  let zoomControl = new daum.maps.ZoomControl();
  map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
  map.setZoomable(false);
  this.__execs__.map = map;
}

export default _map;