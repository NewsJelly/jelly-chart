jelly.line().container('#jelly-container')
  .data([
    {category:'AAA', x: new Date('07/14/2018 00:00:00'), y: 10},{category:'AAA', x: new Date('07/15/2018 00:00:00'), y: 20},
    {category:'AAA', x: new Date('07/16/2018 00:00:00'), y: 30},{category:'AAA', x: new Date('07/17/2018 00:00:00'), y: 40},
    {category:'AAA', x: new Date('07/18/2018 00:00:00'), y: 50},{category:'AAA', x: new Date('07/19/2018 00:00:00'), y: 30},
    {category:'AAA', x: new Date('07/20/2018 00:00:00'), y: 40},{category:'AAA', x: new Date('07/21/2018 00:00:00'), y: 100},
    {category:'AAA', x: new Date('07/22/2018 00:00:00'), y: 20},{category:'AAA', x: new Date('07/23/2018 00:00:00'), y: 120},
    {category:'AAA', x: new Date('07/24/2018 00:00:00'), y: 30},{category:'AAA', x: new Date('07/25/2018 00:00:00'), y: 90},
    {category:'AAA', x: new Date('07/26/2018 00:00:00'), y: 40},{category:'AAA', x: new Date('07/27/2018 00:00:00'), y: 20},
    {category:'AAA', x: new Date('07/28/2018 00:00:00'), y: 40},{category:'AAA', x: new Date('07/29/2018 00:00:00'), y: 20},
    {category:'AAA', x: new Date('07/30/2018 00:00:00'), y: 40},{category:'AAA', x: new Date('07/31/2018 00:00:00'), y: 20},
    {category:'AAA', x: new Date('08/01/2018 00:00:00'), y: 40},{category:'AAA', x: new Date('08/02/2018 00:00:00'), y: 20},
    {category:'AAA', x: new Date('08/03/2018 00:00:00'), y: 40},{category:'AAA', x: new Date('08/04/2018 00:00:00'), y: 20},
    {category:'BBB', x: new Date('07/14/2018 00:00:00'), y: 20},{category:'BBB', x: new Date('07/15/2018 00:00:00'), y: 10},
    {category:'BBB', x: new Date('07/16/2018 00:00:00'), y: 10},{category:'BBB', x: new Date('07/17/2018 00:00:00'), y: 40},
    {category:'BBB', x: new Date('07/18/2018 00:00:00'), y: 70},{category:'BBB', x: new Date('07/19/2018 00:00:00'), y: 25},
    {category:'BBB', x: new Date('07/20/2018 00:00:00'), y: 20},{category:'BBB', x: new Date('07/21/2018 00:00:00'), y: 90},
    {category:'BBB', x: new Date('07/22/2018 00:00:00'), y: 10},{category:'BBB', x: new Date('07/23/2018 00:00:00'), y: 120},
    {category:'BBB', x: new Date('07/24/2018 00:00:00'), y: 90},{category:'BBB', x: new Date('07/25/2018 00:00:00'), y: 92},
    {category:'BBB', x: new Date('07/26/2018 00:00:00'), y: 20},{category:'BBB', x: new Date('07/27/2018 00:00:00'), y: 21},
    {category:'BBB', x: new Date('07/28/2018 00:00:00'), y: 80},{category:'BBB', x: new Date('07/29/2018 00:00:00'), y: 29},
    {category:'BBB', x: new Date('07/30/2018 00:00:00'), y: 70},{category:'BBB', x: new Date('07/31/2018 00:00:00'), y: 90},
    {category:'BBB', x: new Date('08/01/2018 00:00:00'), y: 80},{category:'BBB', x: new Date('08/02/2018 00:00:00'), y: 30},
    {category:'BBB', x: new Date('08/03/2018 00:00:00'), y: 90},{category:'BBB', x: new Date('08/04/2018 00:00:00'), y: 40},
  ]).dimensions([
    {
      field: 'x',
			order: 'ascending',
			format: '%m/%d',
			interval: 'month'
    }, {
      field: 'category',
      order: 'descending'
    }])
  .measures({field:'y', op:'mean'})
  .stacked(true)
  .point(true)
  .shape('area').areaGradient(true)
  .axis('x').axis('y')
  .legend(true)
  .multiTooltip(true)
  .render();
