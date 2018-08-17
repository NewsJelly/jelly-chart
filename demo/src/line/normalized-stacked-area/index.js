jelly.line().container('#jelly-container')
  .data([
    {category:'AAA', x: 1000, y: 10},{category:'AAA', x: 2000, y: 20},
    {category:'AAA', x: 3000, y: 30},{category:'AAA', x: 4000, y: 40},
    {category:'AAA', x: 1000, y: 50},{category:'AAA', x: 2000, y: 30},
    {category:'AAA', x: 3000, y: 40},{category:'AAA', x: 4000, y: 100},
    {category:'BBB', x: 1000, y: 80},{category:'BBB', x: 2000, y: 60},
    {category:'BBB', x: 3000, y: 50},{category:'BBB', x: 4000, y: 70},
    {category:'BBB', x: 1000, y: 20},{category:'BBB', x: 2000, y: 60},
    {category:'BBB', x: 3000, y: 50},{category:'BBB', x: 4000, y: 60}
  ]).dimensions([
    {
      field: 'x',
      order: 'ascending'
    }, {
      field: 'category',
      order: 'descending'
    }])
  .measures({field:'y', op:'mean'})
  .stacked(true)
  .normalized(true)
  .point(true)
  .shape('area')
  .axis('x').axis('y')
  .legend(true)
  .multiTooltip(true)
  .render();
