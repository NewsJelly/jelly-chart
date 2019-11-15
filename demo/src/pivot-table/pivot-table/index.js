jelly.pivotTable().container('#jelly-container')
    .data([
        {category:'Yellow', name: 'A', value: 20},
        {category:'Yellow', name: 'B', value: 50},
        {category:'Yellow', name: 'C', value: 10},
        {category:'Yellow', name: 'D', value: 40},
        {category:'Green', name: 'A', value: 15},
        {category:'Green', name: 'B', value: 80},
        {category:'Green', name: 'C', value: 40},
        {category:'Green', name: 'D', value: 25},
        {category:'Blue', name: 'A', value: 70},
        {category:'Blue', name: 'B', value: 30},
        {category:'Blue', name: 'C', value: 60},
        {category:'Blue', name: 'D', value: 35},
        {category:'Red', name: 'A', value: 20},
        {category:'Red', name: 'B', value: 10},
        {category:'Red', name: 'C', value: 40},
        {category:'Red', name: 'D', value: 10}
    ]).dimensions(['category', 'name'])
    .measures('value')
    .legend(true)
    .render()