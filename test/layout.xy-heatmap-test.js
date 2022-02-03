const d3 = require('d3');
const tape = require('tape');
const jelly = require('../dist/jelly.node');
const defaultRandTable = require('./defaultRandTable');

tape('jelly-chart xy-heatmap', function(test) {
  const container = 'jelly-test-container';
  d3.select('body').append('div').attr('id', container);
  let xyHeatmap = jelly.xyHeatmap()
    .data(defaultRandTable())
    .container(`#${container}`)
    .width(520).height(480)
    .dimensions(['category0', 'category1'])
    .measures(['number0']);
  xyHeatmap.render();
  const canvas = xyHeatmap.__execs__.canvas;
  test.test('should have a canvas', function(test) {
    test.ok(canvas.node(), document.getElementsByClassName('jelly-chart-g'));
    test.end();
  });
  test.test('should have exact sizes', function(test) {
    test.equal(+canvas.node().parentNode.getAttribute('width'), 520);
    test.equal(+canvas.node().parentNode.getAttribute('height'), 480);
    test.end();
  });
  test.test('should have 15 nodes', function(test) {
    test.equal(canvas.selectAll('.jellychart-node').size(), 15);
    test.end();
  });
  test.end();
});