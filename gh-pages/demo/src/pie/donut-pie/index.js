jelly.pie()
  .container('#jelly-container')
  .data([
    {category:'AAA', value: 10},
    {category:'BBB', value: 20},
    {category:'CCC', value: 30},
    {category:'AAA', value: 20},
    {category:'BBB', value: 30},
    {category:'CCC', value: 10},
  ])
  .dimensions({field:'category', order:'descending'})
  .measures([{field: 'value', op: 'mean'}])
  .size([40, 150])
  .legend({align: 'middle'})
  .render();