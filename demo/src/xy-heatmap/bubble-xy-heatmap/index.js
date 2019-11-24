jelly.xyHeatmap().container('#jelly-container')
    .data([
    {category:'Blue', name: 'A', value: 10},
    {category:'Blue', name: 'B', value: 20},
    {category:'Blue', name: 'C', value: 30},
    {category:'Blue', name: 'D', value: 40},
    {category:'Red', name: 'A', value: 20},
    {category:'Red', name: 'B', value: 10},
    {category:'Red', name: 'C', value: 40},
    {category:'Red', name: 'D', value: 10},
    {category:'Green', name: 'A', value: 20},
    {category:'Green', name: 'B', value: 40},
    {category:'Green', name: 'C', value: 30},
    {category:'Green', name: 'D', value: 10},
    {category:'Yellow', name: 'A', value: 30},
    {category:'Yellow', name: 'B', value: 30},
    {category:'Yellow', name: 'C', value: 15},
    {category:'Yellow', name: 'D', value: 35}
    ]).dimensions(['category', 'name'])
    .measures('value')
    .axis('x').axis('y')
    .shape('bubble-heatmap')
    .legend(true)
    .render();