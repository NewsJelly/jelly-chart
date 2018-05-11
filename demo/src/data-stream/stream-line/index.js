var line = jelly.line().container('#jelly-container')
.data([
  {category:'AAA', x: 1000, y: 10},{category:'AAA', x: 2000, y: 20},
  {category:'AAA', x: 3000, y: 30},{category:'AAA', x: 4000, y: 40},
  {category:'AAA', x: 1000, y: 50},{category:'AAA', x: 2000, y: 30},
  {category:'AAA', x: 3000, y: 40},{category:'AAA', x: 4000, y: 100},
  {category:'BBB', x: 1000, y: 80},{category:'BBB', x: 2000, y: 60},
  {category:'BBB', x: 3000, y: 50},{category:'BBB', x: 4000, y: 70},
  {category:'BBB', x: 1000, y: 20},{category:'BBB', x: 2000, y: 60},
  {category:'BBB', x: 3000, y: 50},{category:'BBB', x: 4000, y: 60}
])
.dimensions({field: 'x'})
.measures({field:'y', op:'mean', customDomain: [0, 100]})
.viewInterval(3000)
.axis('x').axis('y')
.point(true)
.render();

var lastValue = 4000;
var timer = setInterval(function() {
  lastValue += 1000;
  line.stream([
    {category:'AAA', x: lastValue, y: Math.random() * 100},
    {category:'BBB', x: lastValue, y: Math.random() * 100}
  ]).render(true);
  if (lastValue > 5000) clearInterval(timer);
}, 1400);

