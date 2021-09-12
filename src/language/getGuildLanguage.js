module.exports = async (guildID) => {
  dbSchema.clear('select');
  dbSchema.clear('where');
  const result = await dbSchema
    .select('language')
    .where({ id: guildID })
    .from('guild_settings');
  dbSchema.clear('select');
  dbSchema.clear('where');
  return result[0].language;
};
