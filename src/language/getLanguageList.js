const path = require('path');
const fs = require('fs');

module.exports = () => {
  const languageList = [];
  const languageFiles = fs.readdirSync(path.resolve(__dirname, 'languages'));
  languageFiles.forEach((languageFile) => {
    const languageRawData = fs.readFileSync(
      path.resolve(__dirname, 'languages', languageFile),
      'utf8'
    );
    const languageData = JSON.parse(languageRawData);
    languageList.push({
      languageCode: languageData.$languageCode,
      englishLanguageName: languageData.$englishLanguageName,
      localLanguageName: languageData.$localLanguageName,
    });
  });
  return languageList;
};
