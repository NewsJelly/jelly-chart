var path = require('path');

var createPattern = function (path) {
  return {pattern: path, included: true, served: true, watched: false};
};

var initTAP = function (files, tapConfig) {
  files.unshift(createPattern(path.join(__dirname, '/lib/adapter.js')));
};

initTAP.$inject = ['config.files'];

module.exports = {
  'framework:tap': ['factory', initTAP]
};
