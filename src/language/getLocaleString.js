const fs = require('fs');
const path = require('path');
const { Liquid } = require('liquidjs');

const rootPath = require.main.path;
const engine = new Liquid();

module.exports = (language, string, data) => {
  const rawLanguageData = fs.readFileSync(
    path.join(rootPath, 'language', 'languages', `${language}.json`)
  );
  const languageData = JSON.parse(rawLanguageData);
  const localeString = languageData[string];
  const resultString = engine.parseAndRenderSync(localeString, data);
  return resultString;
};
