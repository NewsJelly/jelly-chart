const d3 = require('d3');
const tape = require('tape');
const jelly = require('../dist/jelly.node');
const defaultRandTable = require('./defaultRandTable');

tape('jelly-chart mono bar', function(test) {
  const container = 'jelly-test-container-mono';
  const continerEl = d3.select('body').append('div').attr('id', container);
  let bar = jelly.bar()
    .data(defaultRandTable())
    .container(`#${container}`)
    .width(520).height(480)
    .dimensions(['category0'])
    .measures(['number0'])
    .axis('x').axis('y');
  bar.render();
  const canvas = bar.__execs__.canvas;
  test.test('mono bar should have a canvas', function(test) {
    test.ok(canvas.node());
    test.end();
  });
  test.test('mono bar should have exact sizes', function(test) {
    test.equal(+canvas.node().parentNode.getAttribute('width'), 520);
    test.equal(+canvas.node().parentNode.getAttribute('height'), 480);
    test.end();
  });
  test.test('mono bar should have 3 bars', function(test) {
    test.equal(canvas.selectAll('.jellychart-node').size(), 3);
    test.end();
  });
  
  test.test('mono bar should have 2 axes', function(test) {
    test.equal(canvas.selectAll('.jellychart-axis').size(), 2);
    test.end();
  });

  bar.remove();
  continerEl.remove();
  test.end();
});

tape('jelly-chart streaming mono bar ', function(test) {
  const container = 'jelly-test-container-mono';
  const continerEl = d3.select('body').append('div').attr('id', container);
  let bar = jelly.bar()
    .data(defaultRandTable())
    .container(`#${container}`)
    .width(520).height(480)
    .dimensions(['category0'])
    .measures(['number0'])
    .axis('x').axis('y');
  bar.render();
  bar.stream([{category0: "DDD", number0: 100}]).render(true);
  const canvas = bar.__execs__.canvas;
  test.test('mono bar should have 4 bars after streaming', function(test) {
    test.equal(canvas.selectAll('.jellychart-node').size(), 4);
    test.end();
  });
  continerEl.remove();
  test.end();
});

tape('jelly-chart grouped bar', function(test) {
  const container = 'jelly-test-container-grouped';
  const continerEl = d3.select('body').append('div').attr('id', container);
  let bar = jelly.bar()
    .data(defaultRandTable())
    .container(`#${container}`)
    .dimensions(['category0', 'category1'])
    .measures(['number0']);
  bar.render();
  const canvas = bar.__execs__.canvas;
  test.test('grouped bar should have two regions', function(test) {
    test.equal(canvas.selectAll('.jellychart-region').size(), 3);
    test.end();
  });

  test.test('grouped bar should have 15 bars', function(test) {
    test.equal(canvas.selectAll('.jellychart-node').size(), 15);
    test.end();
  });

  bar.remove();
  continerEl.remove();
  test.end();
})

tape('jelly-chart multi-variate bar', function(test) {
  const container = 'jelly-test-container-multivariate';
  const continerEl = d3.select('body').append('div').attr('id', container);
  let bar = jelly.bar()
    .data(defaultRandTable())
    .container(`#${container}`)
    .dimensions(['category0'])
    .measures(['number0', 'number1']);
  bar.render();
  const canvas = bar.__execs__.canvas;
  test.test('multi-variate bar should have 3 regions', function(test) {
    test.equal(canvas.selectAll('.jellychart-region').size(), 3);
    test.end();
  });

  test.test('multi-variate bar should have 6 bars', function(test) {
    test.equal(canvas.selectAll('.jellychart-node').size(), 6);
    test.end();
  });

  bar.remove();
  continerEl.remove();
  test.end();
})