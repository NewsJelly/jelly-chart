jelly.pie() .container('#jelly-container')
    .data([
        {category:'AAA', value: 52}
    ])
    .dimensions('category')
    .measures('value')
    .size([90, 150])
    .shape('gauge')
    .maxValue(100)
    .label(true)
    .render();