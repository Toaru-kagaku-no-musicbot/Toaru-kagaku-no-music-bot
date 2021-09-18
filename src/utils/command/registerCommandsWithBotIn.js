/* eslint no-param-reassign: 0 */

/*
Original code from:
slash-create/src/creator.ts registerCommandsIn
*/

const requireAll = require('require-all');

module.exports = (
  creator,
  options,
  botClient,
  isGuildCommand,
  guildID,
  language
) => {
  const obj = requireAll(options);
  const commands = [];
  function iterate(object) {
    Object.values(object).forEach((Command) => {
      if (Command.name === 'BaseCommand') return;
      if (typeof Command === 'function') {
        if (isGuildCommand)
          commands.push(new Command(creator, botClient, guildID, language));
        else commands.push(new Command(creator, botClient));
      } else if (typeof Command === 'object') iterate(Command);
    });
  }
  iterate(obj);
  if (typeof options === 'string' && !creator.commandsPath)
    creator.commandsPath = options;
  else if (typeof options === 'object' && !creator.commandsPath)
    creator.commandsPath = options.dirname;
  return creator.registerCommands(commands, true);
};
