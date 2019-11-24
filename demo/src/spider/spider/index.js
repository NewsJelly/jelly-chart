jelly.spider().container('#jelly-container')
    .data([
        {category: 'AAA', value1: 10},
        {category: 'AAA', value2: 5},
        {category: 'AAA', value3: 7},
        {category: 'AAA', value4: 2},
        {category: 'AAA', value5: 8},
        {category: 'BBB', value1: 7},
        {category: 'BBB', value2: 8},
        {category: 'BBB', value3: 2},
        {category: 'BBB', value4: 6},
        {category: 'BBB', value5: 3}
    ])
    .dimension('category')
    .measures(['value1','value2','value3','value4','value5'])
    .legend(true)
    .tooltip(true)
    .maxValue(10)
    .level(5)
    .render();