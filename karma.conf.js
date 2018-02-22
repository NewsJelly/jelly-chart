module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'tap'],
    files: [
      'http://apis.daum.net/maps/maps3.js?apikey=7fd8127881fe4e612aabd7d3aca98636&libraries=services', //daum api
      'test/**/*-test.js'
    ],
    preprocessors: {
      'test/**/*-test.js': [ 'browserify' ]
    },
    browserify: {
      debug: true,
      transform: [['babelify', { presets: ['env']}]]
    },
    browsers: ['Chrome'],
    reporters: ['spec'],
    crossOriginAttribute: false
  });
};
