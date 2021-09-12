module.exports = async (guildID, newLanguageCode) => {
  dbSchema.clear('select');
  dbSchema.clear('where');
  const result = await dbSchema
    .from('guild_settings')
    .where({ id: guildID })
    .update('language', newLanguageCode);
  dbSchema.clear('select');
  dbSchema.clear('where');
  return result === 1;
};
