module.exports = (creator, guildID) => {
  const allCommands = creator.commands;
  const guildCommands = [];
  allCommands.each((command) => {
    if (command.guildIDs[0] === guildID) guildCommands.push(command);
  });
  return guildCommands;
};
