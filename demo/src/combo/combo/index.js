jelly.combo()
  .container('#jelly-container')
  .data([
    {name: 'A', valueBar: 10, valueLine: 100},
    {name: 'B', valueBar: 20, valueLine: 200},
    {name: 'C', valueBar: 30, valueLine: 300},
    {name: 'D', valueBar: 40, valueLine: 400},
    {name: 'A', valueBar: 20, valueLine: 200},
    {name: 'B', valueBar: 10, valueLine: 100},
    {name: 'C', valueBar: 40, valueLine: 400},
    {name: 'D', valueBar: 10, valueLine: 100}
  ])
  .dimensions(['name'])
  .measures(['valueBar', 'valueLine'])
  .axis('x').axis('y')
  .render();