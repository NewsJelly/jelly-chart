jelly.treemap().container('#jelly-container')
  .data([
    {d0: 'AAA', d1: 'AA', d2: 'A', value: 10},{d0: 'AAA', d1: 'AA', d2: 'B', value: 100},
    {d0: 'AAA', d1: 'BB', d2: 'A', value: 20},{d0: 'AAA', d1: 'BB', d2: 'B', value: 90},
    {d0: 'AAA', d1: 'AA', d2: 'A', value: 30},{d0: 'AAA', d1: 'AA', d2: 'B', value: 80},
    {d0: 'AAA', d1: 'BB', d2: 'A', value: 40},{d0: 'AAA', d1: 'BB', d2: 'B', value: 70},
    {d0: 'AAA', d1: 'AA', d2: 'A', value: 30},{d0: 'AAA', d1: 'AA', d2: 'B', value: 60},
    {d0: 'AAA', d1: 'BB', d2: 'A', value: 20},{d0: 'AAA', d1: 'BB', d2: 'B', value: 50},
    {d0: 'BBB', d1: 'AA', d2: 'A', value: 10},{d0: 'BBB', d1: 'AA', d2: 'B', value: 40},
    {d0: 'BBB', d1: 'BB', d2: 'A', value: 20},{d0: 'BBB', d1: 'BB', d2: 'B', value: 30},
    {d0: 'BBB', d1: 'AA', d2: 'A', value: 30},{d0: 'BBB', d1: 'AA', d2: 'B', value: 20},
    {d0: 'BBB', d1: 'BB', d2: 'A', value: 40},{d0: 'BBB', d1: 'BB', d2: 'B', value: 10},
    {d0: 'BBB', d1: 'AA', d2: 'A', value: 30},{d0: 'BBB', d1: 'AA', d2: 'B', value: 20},
    {d0: 'BBB', d1: 'BB', d2: 'A', value: 20},{d0: 'BBB', d1: 'BB', d2: 'B', value: 30}
    
  ]).dimensions(['d0', 'd1', 'd2'])
  .measures({field:'value', op: 'sum'})
  .shape('pack')
  .size(400)
  .legend(true)
  .render();