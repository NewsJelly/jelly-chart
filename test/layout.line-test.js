const d3 = require('d3');
const tape = require('tape');
const jelly = require('../dist/jelly.node');
const defaultRandTable = require('./defaultRandTable');

tape('jelly-chart mono line', function(test) {
  const container = 'jelly-test-container-mono';
  d3.select('body').append('div').attr('id', container);
  let line = jelly.line()
    .data(defaultRandTable())
    .container(`#${container}`)
    .width(520).height(480)
    .dimensions(['category0'])
    .measures(['number1'])
    .axis('x').axis('y');
  line.render();
  const canvas = line.__execs__.canvas;
  test.test('mono line should have a canvas', function(test) {
    test.ok(canvas.node(), document.getElementsByClassName('jelly-chart-g'));
    test.end();
  });
  test.test('mono line should have exact sizes', function(test) {
    test.equal(+canvas.node().parentNode.getAttribute('width'), 520);
    test.equal(+canvas.node().parentNode.getAttribute('height'), 480);
    test.end();
  });
  test.test('mono line should have a series', function(test) {
    test.equal(canvas.selectAll('.jellychart-series').size(), 1);
    test.end();
  });
  test.end();
});

tape('jelly-chart streaming mono line', function(test) {
  const container = 'jelly-test-container-streaming-mono';
  d3.select('body').append('div').attr('id', container);
  let line = jelly.line()
    .data(defaultRandTable())
    .container(`#${container}`)
    .width(520).height(480)
    .dimensions(['category0'])
    .measures(['number1'])
    .axis('x').axis('y');
  line.render();
  line.stream([{category0: "DDD", number0: 100}]).render(true);
  const canvas = line.__execs__.canvas;
  test.test('streaming mono line should have 4 points', function(test) {
    test.equal(canvas.selectAll('.jellychart-node').size(), 4);
    test.end();
  });
  test.end();
});

tape('jelly-chart multi-series line', function(test) {
  const container = 'jelly-test-container-multi';
  d3.select('body').append('div').attr('id', container);
  let line = jelly.line()
    .data(defaultRandTable())
    .container(`#${container}`)
    .dimensions(['number0', 'category0'])
    .measures(['number1'])
  line.render();
  const canvas = line.__execs__.canvas.node();
  
  test.test('multi-series line should have 3 series', function(test) {
    test.equal(d3.select(canvas).selectAll('.jellychart-series').size(), 3);
    test.end();
  });
  test.end();
});

tape('jelly-chart multi-variate line', function(test) {
  const container = 'jelly-test-container-multivar';
  d3.select('body').append('div').attr('id', container);
  let line = jelly.line()
    .data(defaultRandTable())
    .container(`#${container}`)
    .dimensions(['number0'])
    .measures(['number1', 'number2'])
  line.render();
  const canvas = line.__execs__.canvas.node();
  
  test.test('multi-variate line should have 2 series', function(test) {
    test.equal(d3.select(canvas).selectAll('.jellychart-series').size(), 2);
    test.end();
  });
  test.end();
});