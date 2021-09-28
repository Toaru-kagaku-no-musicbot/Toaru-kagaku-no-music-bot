require('dotenv').config();
require('./utils/verifyConfig')();
const Discord = require('discord.js');
const { SlashCreator, GatewayServer } = require('slash-create');
const CatLoggr = require('cat-loggr');
const initDB = require('./database/initDB');
const addGuildLocalCommands = require('./utils/command/addGuildLocalCommands');

const logger = new CatLoggr().setLevel(
  process.env.NODE_ENV === 'production' ? 'verbose' : 'debug'
);

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
const creator = new SlashCreator({
  applicationID: process.env.APPLICATION_ID,
  publicKey: process.env.APPLICATION_PUBLIC_KEY,
  token: process.env.TOKEN,
});

creator.on('debug', (message) => logger.log(message));
creator.on('warn', (message) => logger.warn(message));
creator.on('error', (error) => logger.error(error));
creator.on('synced', () => logger.info('Commands synced!'));
creator.on('commandRun', (command, _, ctx) =>
  logger.info(
    `${ctx.member.user.username}#${ctx.member.user.discriminator} (${ctx.member.id}) ran command ${command.commandName}`
  )
);
creator.on('commandRegister', (command) =>
  logger.info(`Registered command ${command.commandName}`)
);
creator.on('commandError', (command, error) => {
  logger.error(`Command ${command.commandName}:`, error);
});

// TODO: Remove TEST_GUILD_ID in production.
const TEST_GUILD_ID = '885491889862766592';
const TEST_GUILD_ID2 = '803935936219578368';

client.on('ready', async () => {
  await initDB();
  logger.info('I am ready!');
  logger.info(`Client user ID: ${client.user.id}`);
  logger.info(`User Name: ${client.user.tag}`);
  creator.withServer(
    new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler))
  );
  await addGuildLocalCommands(creator, client, TEST_GUILD_ID);
  await addGuildLocalCommands(creator, client, TEST_GUILD_ID2);
});

client.login(process.env.TOKEN);
