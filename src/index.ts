import 'any-promise/register/bluebird';

import path from 'path';
import hapi from 'hapi';
import config from 'config';
import migrate from 'node-pg-migrate';

import logging from './plugins/logging';
import auth from './plugins/auth';
import routes from './routes';

import yargs from 'yargs';

const argv = yargs.argv;
if (argv.getDatabaseUrl) {
  console.log(config.get('database.url'));
  process.exit(0);
}

const port = config.get<number>('port');
const server = new hapi.Server({
  host: '0.0.0.0',
  port
});

const gracefulShutdown = () => {
  console.info('Shutting down...');
  server
    .stop()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

migrate({
  databaseUrl: config.get<string>('database.url'),
  dir: path.join(__dirname, './migrations'),
  direction: 'up',
  migrationsTable: 'pgmigrations',
  count: Infinity,
  ignorePattern: '\\..*'
}).then(() =>
  server
    .register([logging, auth])
    .then(() => {
      server.route(routes);
      return server.start().then(() => console.log('Server started'));
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    })
);
