import hapi from 'hapi';

const port = process.env.PORT || 5000;
const server = new hapi.Server({
  host: '0.0.0.0',
  port
});

server.route({
  method: 'GET',
  path: '/',
  options: {
    auth: false
  },
  handler: () => ({})
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

server.start().then(() => console.log('Server started'));
