const chalk = require('chalk');
const { parseCss, cleanPx } = require('./utils');

/**
 * Renders X rows of vertical margin where X is the number of pixels passed in.
 * @function renderVerticalMargin
 * @param {String} px - the amount of vertical margin you want. (ex: "2px" will render 2 rows of margin)
 * @return {void}
 */
const renderVerticalMargin = (px = '') => {
  const rows = cleanPx(px);
  if (rows === '' || parseInt(rows) <= 0) {
    return;
  }
  process.stdout.write('\n'.repeat(rows))
};

// helper function for renderTd & renderTh
const getColumnString = (text, maxLength, textAlign = 'left') => {
  let leftSpacingCount = 0, rightSpacingCount = 0;
  if (textAlign === 'left') {
    rightSpacingCount = maxLength - text.length + 1;
  } else if (textAlign === 'right') {
    leftSpacingCount = maxLength - text.length + 1;
    rightSpacingCount = 1;
  } else if (textAlign === 'center') {
    leftSpacingCount = Math.floor((maxLength - text.length + 1) / 2);
    rightSpacingCount = maxLength - text.length - leftSpacingCount;
  }
  return ' '.repeat(leftSpacingCount) + text + ' '.repeat(rightSpacingCount);
}

/**
 * Renders a td.
 * @function renderTd
 * @param {Object} node - A node from 'node-html-parser'
 * @return {void}
 */
const renderTd = (node, maxLength) => {
  const cssProps = parseCss(node.rawAttrs);
  const output = getColumnString(node.rawText, maxLength || node.rawText.length, cssProps['text-align']);
  process.stdout.write(output);
};

/**
 * Renders a th.
 * @function renderTh
 * @param {Object} node - A node from 'node-html-parser'
 * @return {void}
 */
const renderTh = (node, maxLength) => {
  const cssProps = parseCss(node.rawAttrs);
  const output = getColumnString(node.rawText, maxLength, cssProps['text-align'] || 'center')
  process.stdout.write(output);
};


/**
 * Renders a paragraph.
 * @function renderParagraph
 * @param {Object} node - A node from 'node-html-parser'
 * @return {void}
 */
const renderParagraph = (pNode) => {
  let output = pNode.rawText;
  let color = 'white';
  const cssProps = parseCss(pNode.rawAttrs);
  if (cssProps.color) {
    color = cssProps.color
  }
  renderVerticalMargin(cssProps['margin-top']);
  if (cssProps['margin-left']) {
    output = ' '.repeat(cleanPx(cssProps['margin-left'])) + output;
  }
  process.stdout.write('\n')
  process.stdout.write(chalk[color](output));
  renderVerticalMargin(cssProps['margin-bottom']);
};

/**
 * Renders a table.
 * @function renderTable
 * @param {Object} node - A node from 'node-html-parser'
 * @return {void}
 */
const renderTable = (node) => {
  const cssProps = parseCss(node.rawAttrs);
  const maxLengths = [];

  // get column max lengths
  node.childNodes.forEach((tableChild) => {
    if (tableChild.tagName === 'tr') {
      let count = 0;
      tableChild.childNodes.forEach((trChild) => {
        if (trChild.tagName === 'td' || trChild.tagName === 'th') {
          if (trChild.rawText.length > (maxLengths[count] || -1)) {
            maxLengths[count] = trChild.rawText.length;
          }
          count += 1;
        }
      })
    }
  });

  // scale column widths to the width set for the table
  if (cssProps.width) {
    const newWidth = cleanPx(cssProps.width);
    const oldTotalWidth = maxLengths.reduce((total, colWidth) => total + colWidth, 0);
    maxLengths.forEach((col, i) => {
      maxLengths[i] = Math.floor(col / oldTotalWidth * newWidth);
    })
  }

  // render table
  process.stdout.write('\n')
  renderVerticalMargin(cssProps['margin-top']);

  node.childNodes.forEach((tableChild) => {
    if (tableChild.tagName === 'tr') {
      let count = 0;
      tableChild.childNodes.forEach((trChild) => {
        if (trChild.tagName === 'td') {
          renderTd(trChild, maxLengths[count]);
          count += 1;
        }
        if (trChild.tagName === 'th') {
          renderTh(trChild, maxLengths[count]);
          count += 1;
        }
      });
      process.stdout.write('\n');
    }
  });

  renderVerticalMargin(cssProps['margin-bottom']);
};

module.exports = {
  renderTd,
  renderTh,
  renderParagraph,
  renderVerticalMargin,
  renderTable
};
