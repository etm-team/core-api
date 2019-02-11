import hapi from 'hapi';

import logging from './plugins/logging';
import routes from './routes';

const port = process.env.PORT || 5000;
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

server.register(logging).then(() => {
  server.route(routes);
  return server.start().then(() => console.log('Server started'));
});
