const list = require('./demo/list');
const htmlSrc = list.map(d => { return {src: `./gh-pages/demo/${d.path}.html`, tag: d.path};})
module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'tap'],
    files: [
      'http://apis.daum.net/maps/maps3.js?apikey=7fd8127881fe4e612aabd7d3aca98636&libraries=services', //daum api
      'test/**/*-test.js',
      {pattern: './gh-pages/style/*.css', watched:true, served:true, included:true},
      {pattern: './dist/jelly.js', watched:false, served:true, included:false}
    ],
    preprocessors: {
      'test/**/*-test.js': [ 'browserify' ]
    },
    browserify: {
      debug: true,
      transform: [['babelify', { presets: ['env']}]]
    },
    browsers: ['Chrome'],
    reporters: ['spec', 'karmaHTML'],
    client: {
      karmaHTML: {
        source: htmlSrc
      }
    },
    crossOriginAttribute: false
  });
};
