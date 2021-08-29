require('dotenv').config();
const Discord = require('discord.js');
const { SlashCreator, GatewayServer } = require('slash-create');
const CatLoggr = require('cat-loggr');

const client = new Discord.Client();
const creator = new SlashCreator({
  applicationID: process.env.APPLICATION_ID,
  publicKey: process.env.APPLICATION_PUBLIC_KEY,
  token: process.env.BOT_TOKEN,
});

const logger = new CatLoggr().setLevel(
  process.env.NODE_ENV === 'production' ? 'verbose' : 'debug'
);

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
creator.on('commandError', (command, error) =>
  logger.error(`Command ${command.commandName}:`, error)
);

client.on('ready', async () => {
  logger.info('I am ready!');
  logger.info(`Client user ID: ${client.user.id}`);
  await creator.withServer(
    new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler))
  );
});

client.login(process.env.TOKEN);
