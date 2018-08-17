var randSize = 512;
var dataset = [];
var d, i;
for (i = 0; i < randSize ; i++) {
  let categoryUnit = String.fromCharCode(i  % 3 + 65);
  d = {category : categoryUnit, x : i , y: Math.random() * 10000, z: Math.random() * 10000}
  dataset.push(d);
}

jelly.scatter().data(dataset)
  .container('#jelly-container')
  .dimensions(['category'])
  .measures(['x', 'y'])
  .grid(true)
  .zoom('brush')
  .axis('x').axis('y')
  .render();