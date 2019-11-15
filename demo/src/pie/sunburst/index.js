jelly.pie()
    .container('#jelly-container')
    .data({
            key: 'root',
            children: [
                    {
                            key: 'AAA',
                            children: [
                                    {
                                            key: 'AA-1',
                                            children: [
                                                    {
                                                            key: 'A-1',
                                                            value: 10
                                                    },
                                                    {
                                                            key: 'A-2',
                                                            value: 150
                                                    }
                                            ]
                                    },
                                    {
                                            key: 'AA-2',
                                            value: 23
                                    },
                                    {
                                            key: 'AA-3',
                                            value: 234
                                    },
                                    {
                                            key: 'AA-4',
                                            children: [
                                                    {
                                                            key: 'A-1',
                                                            value: 160
                                                    },
                                                    {
                                                            key: 'A-2',
                                                            value: 10
                                                    }
                                            ]
                                    }
                            ]
                    },
                    {
                            key: 'BBB',
                            value: 250
                    },
                    {
                            key: 'CCC',
                            children: [
                                    {
                                            key: 'CC-1',
                                            value: 345
                                    },
                                    {
                                            key: 'CC-4',
                                            children: [
                                                    {
                                                            key: 'C-1',
                                                            value: 350
                                                    },
                                                    {
                                                            key: 'C-2',
                                                            value: 50
                                                    }
                                            ]
                                    }
                            ]
                    },
                    {
                            key: 'DDD',
                            children: [
                                    {
                                            key: 'DD-1',
                                            value: 345
                                    }
                            ]
                    },
                    {
                            key: 'EEE',
                            children: [
                                    {
                                            key: 'EE-1',
                                            value: 100
                                    },
                                    {
                                            key: 'EE-2',
                                            value: 170
                                    }
                            ]
                    },
                    {
                            key: 'FFF',
                            value: 250
                    }
            ]
    })
    .dimensions(['key'])
    .measures('value')
    .size([50, 100])
    .legend(true)
    .tooltip(true)
    .shape('sunburst')
    .render();