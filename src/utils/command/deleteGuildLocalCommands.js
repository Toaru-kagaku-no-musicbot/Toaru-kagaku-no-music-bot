const getRegisteredGuildCommands = require('./getRegisteredGuildCommands');

module.exports = async (creator, guildID) => {
  const guildCommands = getRegisteredGuildCommands(creator, guildID);
  guildCommands.forEach((command) => {
    creator.unregisterCommand(command);
  });
  await creator.syncCommandsIn(guildID);
};
