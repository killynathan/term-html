const { parse } = require('node-html-parser');
const fs = require('fs');
const { renderParagraph, renderTd, renderTh, renderTable } = require('./renderers');

const readNode = (node) => {
  node.childNodes.forEach((childNode) => {
    const { tagName } = childNode;
    if (tagName === 'p') {
      renderParagraph(childNode);
    }
    else if (tagName === 'table') {
      renderTable(childNode);
    }
    else if (tagName === 'td') {
      renderTd(childNode);
    }
    else if (tagName === 'th') {
      renderTh(childNode);
    }

    // Dont drill deeper for table cause I had table's children in renderTable.
    // I could look into bettering this. 
    if (tagName !== 'table') {
      readNode(childNode);
    }
  })
}

fs.readFile(__dirname + '/' + (process.argv[2] || './index.html'), 'utf8', (err, html) => {
  if (err) {
    console.log(err);
    return;
  }
  const root = parse(html);
  readNode(root.firstChild)
});
