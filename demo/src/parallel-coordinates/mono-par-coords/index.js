jelly.parCoords().container('#jelly-container')
  .data([
    {c: 'AAA', x: 20, y: 20, z: 10},{c: 'BBB', x: 10, y: 50, z: 50},
    {c: 'AAA', x: 10, y: 30, z: 20},{c: 'BBB', x: 15, y: 10, z: 10},
    {c: 'AAA', x: 30, y: 40, z: 30},{c: 'BBB', x: 25, y: 20, z: 20},
    {c: 'AAA', x: 40, y: 50, z: 40},{c: 'BBB', x: 35, y: 30, z: 30},
    {c: 'AAA', x: 50, y: 10, z: 50},{c: 'BBB', x: 45, y: 40, z: 40}
  ])
  .measures(['x', 'y', 'z'])
  .axis('y')
  .render();