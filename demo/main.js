const fs = require('fs');
const path = require('path');
const marked = require('marked');
const handlebars = require('handlebars');
const util = require('util');
const nest = require('d3-collection').nest;

const srcDir = 'src';
const pageDir = '../gh-pages'
if (!fs.existsSync(path.resolve(__dirname, pageDir))) {
  fs.mkdirSync(path.resolve(__dirname, pageDir));
}

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function generate() {
  try {
    const main = await readFile(path.resolve(__dirname, 'template/main.hbs'));
    const template = handlebars.compile(main.toString());    

    let readme = await readFile(path.resolve(__dirname, '../README.md'));
    await writeFile(
      path.resolve(__dirname, pageDir, 'index.html'), 
      template({
        readme: new handlebars.SafeString(marked(readme.toString()))
      })
    );
  } catch (e) {
    console.error(e);
  }
}

generate();