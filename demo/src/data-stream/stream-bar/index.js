var bar = jelly.bar()
  .container('#jelly-container')
  .data([
    {category:'Blue', name: 'A', value: 10},
    {category:'Blue', name: 'B', value: 20},
    {category:'Blue', name: 'C', value: 30},
    {category:'Blue', name: 'D', value: 40},
    {category:'Red', name: 'A', value: 20},
    {category:'Red', name: 'B', value: 10},
    {category:'Red', name: 'C', value: 40},
    {category:'Red', name: 'D', value: 10}
  ])
  .dimensions({field: 'name'})
  .measures([{field: 'value', op: 'sum'}])
  .viewInterval(4)
  .axis('x').axis('y')
  .render();

  var initChar = 69;
  var timer = setInterval(function() {
    initChar += 1;
    if (initChar > 90) {
      clearInterval(timer);
    } else {
      bar.stream([
        {category:'Blue', name:String.fromCharCode(initChar), value:Math.random() * 100},
        {category:'Red', name:String.fromCharCode(initChar), value:Math.random() * 100}
      ])
        .render(true);
    }
    
  }, 1400);