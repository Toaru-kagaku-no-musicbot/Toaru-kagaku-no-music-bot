const fs = require('fs');
const dotenv = require('dotenv');
const CatLoggr = require('cat-loggr');
const getLanguageList = require('../language/getLanguageList');

const logger = new CatLoggr().setLevel(
  process.env.NODE_ENV === 'production' ? 'verbose' : 'debug'
);

const envConfig = dotenv.parse(fs.readFileSync('.env'));
function getConfig(config) {
  return envConfig[config] ?? process.env[config];
}

function exitWithError(message) {
  logger.error(message);
  process.exit(1);
}

module.exports = () => {
  if (!getConfig('TOKEN')) exitWithError('Discord Bot token is empty.');
  else if (!getConfig('APPLICATION_ID'))
    exitWithError('Discord Application ID is empty.');
  else if (!getConfig('APPLICATION_PUBLIC_KEY'))
    exitWithError('Discord Application public key is empty.');

  if (!getConfig('DB_CONNECTION_STRING')) {
    logger.warn('DB connection string is empty.');
    if (!getConfig('DB_HOST'))
      logger.warn('DB host is empty. The bot will connect to localhost.');
    if (!getConfig('DB_PORT'))
      logger.warn('DB port is empty. The bot will use default port, 5432.');
    if (!getConfig('DB_USE_SSL'))
      logger.warn('DB use SSL is empty. The ssl connection will be disabled.');
    if (!getConfig('DB_DATABASE'))
      logger.warn("Database is empty. The bot will use 'bot' database.");
    if (!getConfig('DB_USER')) exitWithError('DB user is empty.');
    if (!getConfig('DB_USER_PASSWORD'))
      logger.warn('DB user password is empty.');
  }
  if (!getConfig('DB_SCHEMA'))
    logger.warn(
      "DB schema is empty. The bot will use the default schema, 'bot'."
    );

  getLanguageList().forEach((languageData) => {
    const languageCode = languageData.languageCode.toUpperCase();
    const languageName = languageData.englishLanguageName;
    if (!getConfig(`ABOUT_BOT_${languageCode}`))
      logger.warn(
        `${languageName} about is empty. The bot will use a default message.`
      );
    if (!getConfig(`EMBED_FOOTER_${languageCode}`))
      logger.warn(
        `${languageName} embed footer is empty. The embed will not appear.`
      );
  });
  if (!getConfig('COLOR_CODE'))
    logger.warn('Color code is empty. The embed color will not be specified.');
  if (!getConfig('BOT_OWNERS'))
    logger.warn(
      'Bot admin is empty. The bot will get the owner ID from the Discord Application.'
    );
};
