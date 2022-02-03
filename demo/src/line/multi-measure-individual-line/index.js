jelly.line().container('#jelly-container')
  .data([
    {x: 20, y0: 20, y1: 10},{x: 10, y0: 50, y1: 50},
    {x: 10, y0: 30, y1: 20},{x: 10, y0: 10, y1: 10},
    {x: 30, y0: 40, y1: 30},{x: 10, y0: 20, y1: 20},
    {x: 40, y0: 50, y1: 40},{x: 10, y0: 30, y1: 30},
    {x: 50, y0: 10, y1: 50},{x: 10, y0: 40, y1: 40}
  ]).dimensions('x')
  .measures(['y0', {field: 'y1', op: 'mean'}])
  .individualScale(true)
  .axis('x').axis('y')
  .legend(true)
  .point(true)
  .multiTooltip(true)
  .render();