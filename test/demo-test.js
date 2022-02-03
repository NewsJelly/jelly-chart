const tape = require('tape');
const list = require('../demo/list');

const container = 'jelly-container';
tape('jelly demo', function(test) {
  list.forEach(l => {
    test.test(l.title, function(test) {
      if (l.daum) {
        test.pass(); //FIXME: need to test marker-map
        test.end();
        return;
      }
      let curTag = karmaHTML[l.path];
      curTag.open();
      curTag.onstatechange = function(ready) {
        if (ready) {
          setTimeout(() => {
            const _document = curTag.document;
            const containerEl = _document.getElementById(container);
            test.ok(containerEl.getElementsByClassName('jellychart-canvas-g').length > 0)
            this.close();
            test.end();
          }, 220);
        } 
      }  
    })
  });
  test.end();
});