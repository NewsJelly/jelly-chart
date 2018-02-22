var dates = d3.timeDays(new Date(2016, 0, 1), new Date(2017, 11, 31), 1);
var dataLength = 1000;
var dataset = [];
var i;
for (i = 0; i < dataLength; i ++) {
  dataset.push({
    date: dates[i%dates.length],
    category: i %3, 
    value: Math.random() * 1000
  });
}

jelly.line().container('#jelly-container')
  .data(dataset)
  .dimensions([{
    field: 'date', 
    interval: 'day',
    format: '%Y-%m-%d'
  }, 'category'])
  .measures([{field: 'value', op:'mean'}])
  .axis({target: 'x', autoTickFormat: true}).axis('y')
  .zoom('brush')
  .multiTooltip(true)
  .render();