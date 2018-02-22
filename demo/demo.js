const fs = require('fs');
const path = require('path');
const marked = require('marked');
const handlebars = require('handlebars');
const list = require('./list');
const util = require('util');
const nest = require('d3-collection').nest;

const srcDir = 'src';
const pageDir = '../gh-pages'
const distDir = pageDir + '/demo';
if (!fs.existsSync(path.resolve(__dirname, pageDir))) {
  fs.mkdirSync(path.resolve(__dirname, pageDir));
}
if (!fs.existsSync(path.resolve(__dirname, distDir))) {
  fs.mkdirSync(path.resolve(__dirname, distDir));
}

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);


async function generate() {
  try {
    const main = await readFile(path.resolve(__dirname, 'template/demo.hbs'));
    const sidebar = await readFile(path.resolve(__dirname, 'template/partial.side.hbs'));
    const template = handlebars.compile(main.toString());    
    handlebars.registerPartial('sidebar', sidebar.toString());
    const group = nest().key(d => d.category).entries(list);
    let lastL;
    for (let l of list) {
      let categoryPath = l.category.split(' ').join('-');
      let containers;
      if (l.containers && l.containers > 1) {
        let i = 0;
        while( i< l.containers) {
          containers.push('jelly-container-' + i);
        }
      } else {
        containers = ['jelly-container'];
      }
      const code = await readFile(path.resolve(__dirname, srcDir, categoryPath, l.path, 'index.js'));
      const desc = await readFile(path.resolve(__dirname, srcDir, categoryPath, l.path, 'index.md'));
      const context = {
        path: l.path, 
        title: l.title, 
        desc: new handlebars.SafeString(marked(desc.toString())),
        code: new handlebars.SafeString(code.toString()),
        group: group,
        containers: containers, 
        daum: l.daum
      };
      if (lastL) lastL.selected = false;
      l.selected = true;
      lastL = l;
      await writeFile(path.resolve(__dirname, distDir, l.path + '.html'), template(context))
    }
  } catch (e) {
    console.error(e);
  }
}

generate();