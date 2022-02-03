const d3 = require('d3');
const tape = require('tape');
const jelly = require('../dist/jelly.node');
const defaultRandTable = require('./defaultRandTable');

tape('jelly-chart mono par-coords', function(test) {
  const container = 'jelly-test-container'; 
  d3.select('body').append('div').attr('id', container);
  let parCoords = jelly.parCoords()
    .data(defaultRandTable(200))
    .container(`#${container}`)
    .width(520).height(480)
    .measures(['number0', 'number1', 'number2'])
    .axis('y');
  parCoords.render();
  const canvas = parCoords.__execs__.canvas;
  test.test('mono par-coords should have a canvas', function(test) {
    test.ok(canvas.node(), document.getElementsByClassName('jelly-chart-g'));
    test.end();
  });
  test.test('mono par-coords should have exact sizes', function(test) {
    test.equal(+canvas.node().parentNode.getAttribute('width'), 520);
    test.equal(+canvas.node().parentNode.getAttribute('height'), 480);
    test.end();
  });
  test.test('mono par-coords should have 200 serieses', function(test) {
    test.equal(canvas.selectAll('.jellychart-series').size(), 200);
    test.end();
  });
  test.test('mono par-coords should have 3 axes', function(test) {
    test.equal(canvas.selectAll('.jellychart-axis').size(), 3);
    test.end();
  });
  test.end();
});