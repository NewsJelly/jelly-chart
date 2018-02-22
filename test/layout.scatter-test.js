const d3 = require('d3');
const tape = require('tape');
const jelly = require('../dist/jelly.node');
const defaultRandTable = require('./defaultRandTable');

tape('jelly-chart mono scatter', function(test) {
  const container = 'jelly-test-container';
  d3.select('body').append('div').attr('id', container);
  let scatter = jelly.scatter()
    .data(defaultRandTable(200))
    .container(`#${container}`)
    .width(520).height(480)
    .measures(['number0', 'number1'])
    .axis('x').axis('y');
  scatter.render();
  const canvas = scatter.__execs__.canvas;
  test.test('should have a canvas', function(test) {
    test.ok(canvas.node());
    test.end();
  });
  test.test('should have exact sizes', function(test) {
    test.equal(+canvas.node().parentNode.getAttribute('width'), 520);
    test.equal(+canvas.node().parentNode.getAttribute('height'), 480);
    test.end();
  });
  test.test('should have 200 points', function(test) {
    test.equal(canvas.selectAll('.jellychart-node').size(), 200);
    test.end();
  });
  
  test.end();
});