var latLngPoints = []
for (var i = 0; i < 20; i++ ) {
  latLngPoints.push({
    lat: 36.5 + (Math.random()-0.5) * 0.5, 
    lng: 128 + (Math.random()-0.5) * 0.5, 
    key : (i+1), 
    value : Math.random()*100
  });
}

jelly.markerMap().data(latLngPoints)
  .container('#jelly-container')
  .dimensions(['key']) 
  .measures(['lat', 'lng', 'value'])
  .render();