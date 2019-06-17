/**
 * Removes px from string.
 * @function cleanPx
 * @param {String} val - the string you want to remove "px" from. (ex: "14px")
 * @return {String} - the string without "px". (ex: "14")
 */
const cleanPx = val => (
  val.substring(0, val.indexOf('px'))
);

/**
 * Parses a css string to a dictionaty of css properties.
 * Supported properties: 'color', 'width', 'margin-top', 'margin-bottom', 'margin-left', 'text-align'.
 * Invariant: properties must end in a semi-colon.
 * @function parseCss
 * @param {String} css - the css string you want to parse. (ex: "color:blue; margin-left: 10px;")
 * @return {Object} - {[property]: value} (ex: { color: 'blue', margin-left: '10px' })
 */
const parseCss = (css = '') => {
  const supportedProperties = ['color', 'width', 'margin-top', 'margin-bottom', 'margin-left', 'text-align'];
  return supportedProperties.reduce((result, property) => {
    const startIndex = css.indexOf(`${property}:`);
    if (startIndex !== -1) {
      const endIndex = css.indexOf(';', startIndex);
      return {
        ...result,
        [property]: css.substring(startIndex + property.length + 1, endIndex),
      };
    }
    return result;
  }, {});
};

module.exports = { cleanPx, parseCss }