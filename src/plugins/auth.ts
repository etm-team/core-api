import {Request, Server} from 'hapi';
import Boom from 'boom';
import bell from 'bell';

const packageInfo = require('../../package'); /* tslint:disable-line */

export default {
  name: 'auth',
  version: packageInfo.version,
  register: (server: Server) => {
    return server
      .register(bell)
      .then(() => {
        server.auth.strategy('twitch', 'bell', {
          provider: 'twitch',
          password: '',
          isSecure: false,
          clientId: '',
          clientSecret: ''
        });
      })
      .then(() => {
        server.route({
          method: 'GET',
          path: '/auth/twitch',
          handler: (request: Request) => {
            if (!request.auth.isAuthenticated) {
              return Boom.unauthorized();
            }

            return {
              profile: (request.auth.credentials as any).profile
            };
          },
          options: {
            auth: 'twitch'
          }
        });
      });
  }
};
