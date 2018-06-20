var dates = d3.timeDays(new Date(2016, 0, 1), new Date(2017, 11, 31), 1);
var dataLength = 1000;
var dataset = [];
var i;
for (i = 0; i < dataLength; i ++) {
  dataset.push({
    date: dates[i%dates.length], 
    value: Math.random() * 1000,
    value2: Math.random() * 1000,
  });
}

jelly.line().container('#jelly-container')
  .data(dataset)
  .dimensions({
    field: 'date', 
    interval: 'month',
    format: '%Y-%m'
  })
  .measures([{field: 'value', op:'mean'}, {field: 'value2', op:'mean'}])
  .axis('x').axis('y')
  .legend({orient: 'right', thickness:100})
  .multiTooltip(true)
  .render();