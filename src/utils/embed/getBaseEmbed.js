require('dotenv').config();
const { MessageEmbed } = require('discord.js');

module.exports = (language) => {
  return new MessageEmbed()
    .setColor(Number(process.env.COLOR_CODE))
    .setFooter(process.env[`EMBED_FOOTER_${language.toUpperCase()}`]);
};
