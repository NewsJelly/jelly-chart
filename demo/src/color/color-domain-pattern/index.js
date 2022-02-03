jelly.line().container('#jelly-container')
  .data([
    {category:'AAA', x: 1000, y: 10},{category:'BBB', x: 2000, y: 20},
    {category:'AAA', x: 3000, y: 30},{category:'BBB', x: 4000, y: 40},
    {category:'AAA', x: 1000, y: 50},{category:'BBB', x: 2000, y: 30},
    {category:'AAA', x: 3000, y: 40},{category:'BBB', x: 4000, y: 100},
    {category:'CCC', x: 1000, y: 80},{category:'DDD', x: 2000, y: 60},
    {category:'CCC', x: 3000, y: 50},{category:'DDD', x: 4000, y: 70},
    {category:'CCC', x: 1000, y: 20},{category:'DDD', x: 2000, y: 60},
    {category:'CCC', x: 3000, y: 50},{category:'DDD', x: 4000, y: 60}
  ]).dimensions(['x', 'category'])
  .measures({field:'y', op:'mean'})
  .colorDomain(['CCC', {key: 'DDD', color: 'red'}, 'BBB'])
  .axis('x').axis('y')
  .legend(true)
  .point(true)
  .multiTooltip(true)
  .render();