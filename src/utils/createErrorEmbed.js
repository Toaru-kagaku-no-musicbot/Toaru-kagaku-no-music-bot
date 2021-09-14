const { stripIndents } = require('common-tags');
const getLocaleString = require('../language/getLocaleString');
const getBaseEmbed = require('./getBaseEmbed');

function generateCommandInfo(ctx) {
  const {
    commandName,
    commandID,
    interactionID,
    guildID,
    channelID,
    user,
    invokedAt,
    options,
  } = ctx;
  return stripIndents`Command Name: \`${commandName}\`
  Command ID: \`${commandID}\`
  Interaction ID: \`${interactionID}\`
  Options: \`${JSON.stringify(options)}\`\n
  Guild ID: \`${guildID}\`
  Channel ID: \`${channelID}\`
  User ID: \`${user.id}\`\n
  Invoked At: \`${invokedAt}\``;
}

module.exports = (ctx, command, error) => {
  const { language } = command;

  return getBaseEmbed(language)
    .setColor('RED')
    .setTitle(getLocaleString(language, 'command_error_title'))
    .setDescription(getLocaleString(language, 'command_error_description'))
    .addField(
      getLocaleString(language, 'command_error_command_info'),
      generateCommandInfo(ctx)
    )
    .addField(
      getLocaleString(language, 'command_error_technical_info'),
      `\`\`\`${error}\`\`\``
    );
};
