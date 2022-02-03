var bar = jelly.bar().container('#jelly-container')
  .data([
    {category:'Blue', name: 'A', value: 10},
    {category:'Blue', name: 'B', value: 20},
    {category:'Blue', name: 'C', value: 30},
    {category:'Blue', name: 'D', value: 40},
    {category:'Red', name: 'A', value: 20},
    {category:'Red', name: 'B', value: 10},
    {category:'Red', name: 'C', value: 40},
    {category:'Red', name: 'D', value: 10}
  ]).dimensions(['category', 'name'])
  .measures('value')
  .axis('x').axis('y')
  .legend(true)
bar.render();
//If you hover or click a node, it will print the node's key on console.
bar.on('selectEnter', function(d) {
  console.log('Enter: ' + d.key);
}).on('selectLeave', function(d) {
  console.log('Leave: ' + d.key);
}).on('selectClick', function(d) {
  console.log('Click: ' + d.key);
})