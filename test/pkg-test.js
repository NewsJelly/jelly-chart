const tape = require('tape');
const jelly = require('../dist/jelly.node');

const layouts = require('./layouts');

tape('jelly.[layout]() returns an instanceof [layout]', function(test) {
  layouts.forEach(l => {
    test.ok(jelly[l]() instanceof jelly[l].__class__)
    test.ok(jelly.type(l)() instanceof jelly[l].__class__)
  });
  test.end();
});