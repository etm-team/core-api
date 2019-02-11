import {Server} from 'hapi';
import good from 'good';

const packageInfo = require('../../package'); /* tslint:disable-line */

export default {
  name: 'logging',
  version: packageInfo.version,
  register: (server: Server) => {
    const logging: any = {
      plugin: good,
      options: {
        ops: {
          interval: 1000
        },
        reporters: {
          logs: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [
                {
                  log: '*',
                  response: {
                    include: '*',
                    exclude: 'health'
                  }
                }
              ]
            },
            {
              module: 'good-console'
            },
            'stdout'
          ],
          errors: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [
                {
                  error: '*'
                }
              ]
            },
            {
              module: 'good-console'
            },
            'stderr'
          ]
        }
      }
    };

    return server.register(logging);
  }
};
