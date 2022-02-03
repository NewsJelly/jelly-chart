import {latMeasure, lngMeasure} from './';
import {labelFormat} from '../../modules/util';

function _addr2coord (addr, geocoder, callback) { 
  geocoder.addr2coord(addr, function (status, result) {
    if (status === daum.maps.services.Status.OK) {
      return callback(null, result.addr[0]);
    } else {
      return callback(status); 
    }
  });
}

function _rScaleRange (scale, level, size) {
  let magVal = Math.pow(2, level); 
  scale.range([size.range[0] * magVal, size.range[1] * magVal]); 
}
function _mark() {
  const map = this.__execs__.map;
  const field = this.__execs__.field;
  const scale = this.__execs__.scale;
  const dispatch = this.__execs__.dispatch;
  const isAddr = this.addr();
  const label = this.label();
  const target = this.data();
  const isSized = this.isSized();
  const size = this.size();
  const color = this.color();
  const geocoder = new daum.maps.services.Geocoder();
  const circles = [];
  
  let __set = function() {
    const latlng = target.map(d => new daum.maps.LatLng(d[field.lat.field], d[field.lng.field]));
    const bounds = new daum.maps.LatLngBounds();
    latlng.forEach(function (d) {
      bounds.extend(d);
    });
    map.setBounds(bounds);
    const level = map.getLevel();
    if(isSized) _rScaleRange(scale.r, level, size);
  }
  let __nodes = function() {
    const level = map.getLevel();
    const earthR = 111111; // earth radius
    target.forEach(d => {
      const latLng = new daum.maps.LatLng(d[field.lat.field], d[field.lng.field]);
      const radius = isSized ? scale.r(Math.sqrt(d[field.radius.field])) : size.range[0] * Math.pow(2, level);
      const option = {
        clickable: true,
        zIndex: 10,
        center: latLng,  
        radius: radius,
        strokeColor: color[0],
        strokeWeight: 1.5,
        strokeOpacity: 1,
        strokeStyle: 'solid',
        fillColor :  color[0],
        fillOpacity: 0.5
      };
      const circle = new daum.maps.Circle(option);
      circle.setMap(map);
      circles.push(circle);

      const keyVal = field.name ? d[field.name.field] : isAddr ? d[field.addr.field] : 'Y: ' + labelFormat(d[field.lat.field]) + '</br> X: ' + labelFormat(d[field.lng.field]);
      const tooltipText = '<div class="jelly-chart-tooltip" style="padding:4px;font-size:12px;font-family:sans-serif;">' +
      '<div class="jelly-chart-key" style="font-weight:bold;">' + keyVal + '</div>' +
      (isSized  ? '<div class="jelly-chart-value">' + field.radius.field + ': ' + labelFormat(d[field.radius.field]) + '</div>' : '') +
      '</div>';
      const tooltip = new daum.maps.InfoWindow({
        position: new daum.maps.LatLng(d[field.lat.field] + radius / earthR, d[field.lng.field]),
        content: tooltipText
      });
      
      daum.maps.event.addListener(circle, 'mouseover', function () {
        tooltip.open(map);
      });
      daum.maps.event.addListener(circle, 'mouseout', function () {
        tooltip.close();
      });
      

      if (isSized && label) {
        const value = labelFormat(d[field.radius.field]);
        const label = new daum.maps.CustomOverlay({
          position: latLng,
          clickable: true,
          zIndex: -1,
          content: '<div class="label" style="pointer-events:none;padding:4px;font-size:12px;font-family:sans-serif;">' + value + '</div>'
        });
        label.setMap(map);
      }
    })
  }

  if(isAddr) {
    let count = 0;
    
    target.forEach(function(d) {
      let addr = d[field.addr.field];
      let callback = function(err, coord) {
        if(!err) {
          d[latMeasure.field] = coord.lat;
          d[lngMeasure.field] = coord.lng;
        }
        count += 1;
        dispatch.call('loading', this, count);
        if(count === target.length) {
          __set();
          __nodes();
          dispatch.call('end');
        }
      }
      try {
        _addr2coord(addr, geocoder, callback)
      } catch (e) {
        callback(e);
      }
    })
  } else {
    __set();
    __nodes();
  }
  if(!isSized) {
    daum.maps.event.addListener(map, 'zoom_changed', function() {
      const radius = size.range[0] * Math.pow(2, map.getLevel());
      circles.forEach(function(circle) {
        circle.setRadius(radius);
      })
    });
  }
}

export default _mark;