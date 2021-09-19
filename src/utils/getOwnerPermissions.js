require('dotenv').config();
const CatLoggr = require('cat-loggr');
const { User, Team } = require('discord.js');
const { ApplicationCommandPermissionType } = require('slash-create');

const logger = new CatLoggr().setLevel(
  process.env.NODE_ENV === 'production' ? 'verbose' : 'debug'
);

module.exports = (botClient) => {
  let permission = [];
  if (process.env.BOT_OWNERS) {
    const botOwnersString = process.env.BOT_OWNERS;
    const botOwners = botOwnersString.split(',');
    botOwners.forEach((botOwnerID) => {
      permission.push({
        type: ApplicationCommandPermissionType.USER,
        id: botOwnerID,
        permission: true,
      });
    });
  } else {
    const botApplication = botClient.application;
    const applicationOwner = botApplication.owner;
    if (applicationOwner instanceof User) {
      permission.push({
        type: ApplicationCommandPermissionType.USER,
        id: applicationOwner.id,
        permission: true,
      });
    } else if (applicationOwner instanceof Team) {
      const teamMember = applicationOwner.members;
      permission = [];
      teamMember.keys.forEach((teamMemberID) => {
        permission.push({
          type: ApplicationCommandPermissionType.USER,
          id: teamMemberID,
          permission: true,
        });
      });
    } else {
      logger.warn(`Can't get owner IDs! Owner commands will be disabled.`);
    }
  }
  return permission;
};
