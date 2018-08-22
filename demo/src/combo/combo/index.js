jelly.combo()
  .container('#jelly-container')
  .data([
    {name: 'A', valueBar: 1000000, valueLine: 1000000000},
    {name: 'B', valueBar: 2000000, valueLine: 20000000},
    {name: 'C', valueBar: 3000000, valueLine: 30000000},
    {name: 'D', valueBar: 4000000, valueLine: 40000000},
    {name: 'A', valueBar: 2000000, valueLine: 20000000},
    {name: 'B', valueBar: 1000000, valueLine: 10000000},
    {name: 'C', valueBar: 4000000, valueLine: 40000000},
    {name: 'D', valueBar: 1000000, valueLine: 10000000}
  ])
  .dimensions(['name'])
  .measures(['valueBar', 'valueLine'])
	.axis('x').axis({target: 'y', autoTickFormat: true})
  .barWidth(24)
  .shape('area')
	.grid(true)
  .render();
