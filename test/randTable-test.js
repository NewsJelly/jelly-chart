const rand = require('./randTable');
const tape = require('tape');

tape('randomly generated table', function(test) {
  let dataset = rand([
    {field: 'name', type: 'category', cycle: 5, length: 4},
    {field: 'sales', type: 'number', range: [100, 1000]},
    {field: 'date', type: 'date', range:[new Date(2017, 0, 1), new Date(2018, 0, 31)]}
  ], 100);
  test.equal(dataset.length, 100);
  test.equal(typeof dataset[0].name, 'string');
  test.equal(dataset[0].name.length, 4);
  test.equal(typeof dataset[0].sales, 'number');
  test.ok(dataset[0].sales <=1000 && dataset[0].sales >= 100);
  test.ok(dataset[0].date <= new Date(2018, 0, 31) && dataset[0].date >= new Date(2017, 0, 1));
  test.end();
});