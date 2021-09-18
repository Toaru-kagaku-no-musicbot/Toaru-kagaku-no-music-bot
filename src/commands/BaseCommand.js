require('dotenv').config();
const { SlashCommand } = require('slash-create');

const createThrottlingEmbed = require('../utils/embed/createThrottlingEmbed');
const createErrorEmbed = require('../utils/embed/createErrorEmbed');

module.exports = class BaseCommand extends SlashCommand {
  async onBlock(ctx, reason, data) {
    if (reason === 'throttling') {
      ctx.send({ embeds: [createThrottlingEmbed(ctx, this, data).toJSON()] });
    }
  }

  async onError(err, ctx) {
    ctx.send({ embeds: [createErrorEmbed(ctx, this, err).toJSON()] });
  }
};
