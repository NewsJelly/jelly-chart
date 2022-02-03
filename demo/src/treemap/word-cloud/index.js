jelly.treemap().container('#jelly-container')
  .data([
    {category: 'AAA', value: 10}, {category: 'AAA', value: 20},
    {category: 'AAA', value: 30}, {category: 'AAA', value: 40},
    {category: 'BBB', value: 50}, {category: 'BBB', value: 60},
    {category: 'BBB', value: 50}, {category: 'BBB', value: 40},
    {category: 'CCC', value: 30}, {category: 'CCC', value: 20},
    {category: 'CCC', value: 10}, {category: 'CCC', value: 20},
  ]).dimensions('category')
  .measures({field:'value', op: 'mean'})
  .shape('word')
  .legend(true)
  .render();