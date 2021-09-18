const getLocaleString = require('../../language/getLocaleString');
const getBaseEmbed = require('./getBaseEmbed');

module.exports = (ctx, command, data) => {
  const { language } = command;
  const throttleData = data.throttle;
  console.log(data);

  return getBaseEmbed(language)
    .setColor('RED')
    .setTitle(
      getLocaleString(language, 'command_throttle_title', {
        commandName: command.commandName,
      })
    )
    .setDescription(
      getLocaleString(language, 'command_throttle_description', {
        whenAvailable: Math.floor(
          throttleData.start / 1000 + command.throttling.duration
        ),
      })
    );
};
