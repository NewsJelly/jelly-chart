const d3 = require('d3');
const tape = require('tape');
const jelly = require('../dist/jelly.node');
const defaultRandTable = require('./defaultRandTable');

tape('jelly-chart 3-level treemap', function(test) {
  const container = 'jelly-test-container-treemap';
  d3.select('body').append('div').attr('id', container);
  let treemap = jelly.treemap()
    .data(defaultRandTable(210))
    .container(`#${container}`)
    .width(520).height(480)
    .dimensions(['category0', 'category1', 'category2'])
    .measures(['number0']);
  treemap.render();
  const canvas = treemap.__execs__.canvas;
  
  test.test('should have a canvas', function(test) {
    test.ok(canvas.node(), document.getElementsByClassName('jelly-chart-g'));
    test.end();
  });
  test.test('should have exact sizes', function(test) {
    test.equal(+canvas.node().parentNode.getAttribute('width'), 520);
    test.equal(+canvas.node().parentNode.getAttribute('height'), 480);
    test.end();
  });
  test.test('should have 15+3 stems and 105 leaves', function(test) {
    test.equal(canvas.selectAll('.jellychart-stem').size(), 18);
    test.equal(canvas.selectAll('.jellychart-leaf').size(), 105);
    test.end();
  });
  test.end();
});