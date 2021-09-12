const path = require('path');
const getGuildLanguage = require('../language/getGuildLanguage');
const registerCommandsWithBotIn = require('./registerCommandsWithBotIn');

module.exports = async (creator, botClient, guildID, language) => {
  const guildLanguage = language ?? (await getGuildLanguage(guildID));
  registerCommandsWithBotIn(
    creator,
    path.join(__dirname, '../', 'commands'),
    botClient,
    true,
    guildID,
    guildLanguage
  );
  await creator.syncCommandsIn(guildID);
};
