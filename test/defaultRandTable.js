const rand = require('./randTable');

const defaultSetting = [
  {field: 'category0', type: 'category', cycle: 3, length: 3},
  {field: 'category1', type: 'category', cycle: 5, length: 5},
  {field: 'category2', type: 'category', cycle: 7, length: 7},
  {field: 'number0', type: 'number', range: [10, 100]},
  {field: 'number1', type: 'number', range: [100, 1000]},
  {field: 'number2', type: 'number', range: [1000, 10000]},
  {field: 'date0', type: 'date', range:[new Date(2016, 0, 1), new Date(2016, 0, 31)]},
  {field: 'date1', type: 'date', range:[new Date(2017, 0, 1), new Date(2017, 0, 31)]},
  {field: 'date3', type: 'date', range:[new Date(2018, 0, 1), new Date(2018, 0, 31)]}
];

module.exports = function(rows = 100) {
  return rand(defaultSetting, rows);
}