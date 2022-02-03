jelly.scatter().container('#jelly-container')
  .data([
    {c: 'AAA', x: 20, y: 20, r: 10},{c: 'BBB', x: 10, y: 50, r: 50},
    {c: 'AAA', x: 10, y: 30, r: 20},{c: 'BBB', x: 15, y: 10, r: 10},
    {c: 'AAA', x: 30, y: 40, r: 30},{c: 'BBB', x: 25, y: 20, r: 20},
    {c: 'AAA', x: 40, y: 50, r: 40},{c: 'BBB', x: 35, y: 30, r: 30},
    {c: 'AAA', x: 50, y: 10, r: 50},{c: 'BBB', x: 45, y: 40, r: 40}
  ])
  .measures(['x', 'y'])
  .axis('x').axis('y')
  .legend(true)
  .render();