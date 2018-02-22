const d3 = require('d3');
const tape = require('tape');
const jelly = require('../dist/jelly.node');
const defaultRandTable = require('./defaultRandTable');

tape('jelly-chart mpie', function(test) {
  const container = 'jelly-test-container';
  d3.select('body').append('div').attr('id', container);
  let pie = jelly.pie()
    .data(defaultRandTable())
    .container(`#${container}`)
    .width(520).height(480)
    .dimensions(['category0'])
    .measures(['number0']);
  pie.render();
  const canvas = pie.__execs__.canvas;
  test.test('pie should have a canvas', function(test) {
    test.ok(canvas.node());
    test.end();
  });
  test.test('pie should have exact sizes', function(test) {
    test.equal(+canvas.node().parentNode.getAttribute('width'), 520);
    test.equal(+canvas.node().parentNode.getAttribute('height'), 480);
    test.end();
  });
  test.test('pie should have 3 arcs', function(test) {
    test.equal(canvas.selectAll('.jellychart-node').size(), 3);
    test.end();
  });
  test.end();
});