const d3 = require('d3');
const tape = require('tape');
const jelly = require('../dist/jelly.node');
const defaultRandTable = require('./defaultRandTable');

tape('jelly-chart mono bar', function(test) {
  const container = 'jelly-test-container';
  d3.select('body').append('div').attr('id', container);
  let combo = jelly.combo()
    .data(defaultRandTable())
    .container(`#${container}`)
    .width(520).height(480)
    .dimensions(['category0'])
    .measures(['number0', 'number1'])
    .axis('x').axis('y');
  combo.render();
  const canvas = combo.__execs__.canvas;
  test.test('should have a canvas', function(test) {
    test.ok(canvas.node());
    test.end();
  });
  test.test('should have exact sizes', function(test) {
    test.equal(+canvas.node().parentNode.getAttribute('width'), 520);
    test.equal(+canvas.node().parentNode.getAttribute('height'), 480);
    test.end();
  });
  test.test('should have 3 bars and 1 line', function(test) {
    test.equal(canvas.selectAll('rect.jellychart-bar').size(), 3);
    test.equal(canvas.selectAll('.jellychart-series').size(), 1);
    test.end();
  });
  test.end();
});