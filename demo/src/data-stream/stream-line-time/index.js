var dates = d3.timeDays(new Date(2016, 0, 1), new Date(2016, 3, 1), 1);
var dataLength = 1000;
var dataset = [];
var i;
for (i = 0; i < dataLength; i ++) {
  dataset.push({
    date: dates[i%dates.length], 
    value: Math.random() * 1000
  });
}

var line = jelly.line().container('#jelly-container')
  .data(dataset)
  .dimensions({
    field: 'date', 
    interval: 'day',
    format: '%Y-%m'
  })
  .measures([{field: 'value', op:'mean', customDomain: [0, 1000]}])
  .viewInterval('month', 3)
  .axis({target: 'x', autoTickFormat: true})
  .axis('y')
  .multiTooltip(true)
  .render();

var lastDate = dates[dates.length-1];
var timer = setInterval(function() {
  lastDate = d3.timeDay.offset(lastDate, 1);
  line.stream([
    {date: lastDate, value: Math.random() * 1000}
  ]).render(true);
  if (new Date(2016, 3, 8) - lastDate < 0) clearInterval(timer);
}, 1400);
