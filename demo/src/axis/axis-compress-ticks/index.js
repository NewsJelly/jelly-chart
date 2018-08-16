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
    {category:'BBB', x: new Date('07/14/2018 00:00:00'), y: 20},{category:'BBB', x: new Date('07/15/2018 00:00:00'), y: 10},
    {category:'BBB', x: new Date('07/16/2018 00:00:00'), y: 10},{category:'BBB', x: new Date('07/17/2018 00:00:00'), y: 40},
    {category:'BBB', x: new Date('07/18/2018 00:00:00'), y: 70},{category:'BBB', x: new Date('07/19/2018 00:00:00'), y: 25},
    {category:'BBB', x: new Date('07/20/2018 00:00:00'), y: 20},{category:'BBB', x: new Date('07/21/2018 00:00:00'), y: 90},
    {category:'BBB', x: new Date('07/22/2018 00:00:00'), y: 10},{category:'BBB', x: new Date('07/23/2018 00:00:00'), y: 120},
    {category:'BBB', x: new Date('07/24/2018 00:00:00'), y: 90},{category:'BBB', x: new Date('07/25/2018 00:00:00'), y: 92},
    {category:'BBB', x: new Date('07/26/2018 00:00:00'), y: 20},{category:'BBB', x: new Date('07/27/2018 00:00:00'), y: 21},
    {category:'BBB', x: new Date('07/28/2018 00:00:00'), y: 80},{category:'BBB', x: new Date('07/29/2018 00:00:00'), y: 29},
  ]).dimensions([
    { field: 'x', order: 'ascending', format: '%m/%d'}, 
    { field: 'category', order: 'descending' }
  ])
  .measures({field:'y', op:'mean'})
  .stacked(true)
  .point(false)
  .shape('area').areaGradient(true)
	.font({'font-size': 12, 'font-family': 'NotoSans', 'color':'#485464', 'font-weight':'normal'})
	.axis({target:'x', compressTicks:true}).axis('y')
  .legend(true)
  .multiTooltip(true)
  .render();
