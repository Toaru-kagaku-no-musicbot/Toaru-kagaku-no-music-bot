require('dotenv').config();
const knex = require('knex');
const CatLoggr = require('cat-loggr');
const getConnectionString = require('./getConnectionString');

const logger = new CatLoggr().setLevel(
  process.env.NODE_ENV === 'production' ? 'verbose' : 'debug'
);

const DB_SCHEMA = process.env.DB_SCHEMA || 'bot';

module.exports = async () => {
  global.db = await knex({
    client: 'pg',
    connection: getConnectionString(),
    debug: process.env.NODE_ENV === 'development',
    log: {
      warn(message) {
        logger.warn(`[Database] ${JSON.stringify(message, null, 2)}`);
      },
      error(message) {
        logger.error(`[Database] ${JSON.stringify(message, null, 2)}`);
      },
      deprecate(message) {
        logger.warn(`[Database] ${JSON.stringify(message, null, 2)}`);
      },
      debug(message) {
        logger.debug(`[Database] ${JSON.stringify(message)}`);
      },
    },
  });

  await db.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [DB_SCHEMA]);
  const schemaBuilder = db.schema.withSchema(DB_SCHEMA);
  const schema = db.withSchema(DB_SCHEMA);
  global.dbSchemaBuilder = schemaBuilder;
  global.dbSchema = schema;

  await schemaBuilder.hasTable('guild_settings').then(async (exists) => {
    if (!exists) {
      await schemaBuilder.createTable('guild_settings', (table) => {
        table.bigInteger('id').primary();
        table.string('language', 5);
      });
    }
  });
};
