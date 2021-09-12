require('dotenv').config();
const { SlashCommand, CommandOptionType } = require('slash-create');
const getLanguageList = require('../language/getLanguageList');
const setGuildLanguage = require('../language/setGuildLanguage');
const getLocaleString = require('../language/getLocaleString');
const getBaseEmbed = require('../utils/getBaseEmbed');
const deleteGuildLocalCommands = require('../utils/deleteGuildLocalCommands');
const addGuildLocalCommands = require('../utils/addGuildLocalCommands');

module.exports = class LanguageCommand extends SlashCommand {
  constructor(creator, botClient, guildID, language) {
    const languageCommandInfo = getLocaleString(language, 'help_language_info');
    const languageChangeCommandInfo = getLocaleString(
      language,
      'help_language_change_info'
    );
    const optionLanguageDescription = getLocaleString(
      language,
      'help_language_change_option_language'
    );

    const languageList = getLanguageList();
    const languageOptions = [];
    languageList.forEach((lang) => {
      languageOptions.push({
        name: `${lang.englishLanguageName} (${lang.localLanguageName})`,
        value: lang.languageCode,
      });
    });
    super(creator, {
      guildIDs: [guildID],
      name: 'language',
      description: languageCommandInfo,
      options: [
        {
          name: 'all',
          description: languageCommandInfo,
          type: CommandOptionType.SUB_COMMAND,
        },
        {
          name: 'change',
          description: languageChangeCommandInfo,
          type: CommandOptionType.SUB_COMMAND,
          options: [
            {
              type: CommandOptionType.STRING,
              name: 'language',
              description: optionLanguageDescription,
              choices: languageOptions,
            },
          ],
        },
      ],
    });
    this.filePath = __filename;
    this.botClient = botClient;
    this.language = language;
  }

  async run(ctx) {
    await ctx.defer();
    if (ctx.subcommands[0] === 'all') {
      const languageList = getLanguageList();
      const languageNameList = [];
      languageList.forEach((lang) => {
        languageNameList.push(
          `- ${lang.englishLanguageName} (${lang.localLanguageName})`
        );
      });
      const languageNameStr = languageNameList.join('\n');
      const languageListEmbed = getBaseEmbed(this.language)
        .setTitle(getLocaleString(this.language, 'set_language_pack_list'))
        .setDescription(languageNameStr);
      await ctx.send({ embeds: [languageListEmbed.toJSON()] });
    }
    if (ctx.subcommands[0] === 'change') {
      const nowLanguage = this.language;
      const toChangeLanguage = ctx.options.change.language;
      const changingLanguageMessage = getLocaleString(
        toChangeLanguage,
        'set_language_pack_changing_language'
      );
      const updatingCommandMessage = getLocaleString(
        toChangeLanguage,
        'set_language_pack_updating_command'
      );
      const completeMessage = getLocaleString(
        toChangeLanguage,
        'set_language_complete'
      );
      const changingLanguageEmbed = getBaseEmbed(toChangeLanguage).setTitle(
        changingLanguageMessage
      );
      const updatingCommandEmbed = getBaseEmbed(toChangeLanguage).setTitle(
        updatingCommandMessage
      );
      const completeEmbed = getBaseEmbed(toChangeLanguage)
        .setTitle(completeMessage)
        .setDescription(`${nowLanguage} → ${toChangeLanguage}`);
      await ctx.send({ embeds: [changingLanguageEmbed.toJSON()] });
      await setGuildLanguage(ctx.guildID, toChangeLanguage);
      await ctx.editOriginal({ embeds: [updatingCommandEmbed.toJSON()] });
      await deleteGuildLocalCommands(ctx.creator, ctx.guildID);
      await addGuildLocalCommands(
        ctx.creator,
        this.botClient,
        ctx.guildID,
        toChangeLanguage
      );
      await ctx.editOriginal({ embeds: [completeEmbed.toJSON()] });
    }
  }
};
