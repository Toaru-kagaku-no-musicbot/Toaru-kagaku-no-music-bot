require('dotenv').config();

const { DB_CONNECTION_STRING } = process.env;
const { DB_USER, DB_USER_PASSWORD } = process.env;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_USE_SSL = process.env.DB_USE_SSL === 'true';
const DB_DATABASE = process.env.DB_DATABASE || 'bot';

module.exports = () => {
  return (
    DB_CONNECTION_STRING ||
    `postgresql://${DB_USER}:${DB_USER_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?useSSL=${DB_USE_SSL}`
  );
};
