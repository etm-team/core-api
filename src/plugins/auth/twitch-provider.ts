import Promise from 'bluebird';
import {Request, Server} from 'hapi';
import Boom from 'boom';
import config from 'config';

import tokens from '../../lib/tokens';
import createConnection from '../../lib/connection';
import findDriverByExternal from '../../data/find-driver-by-external';

const packageInfo = require('../../../package'); /* tslint:disable-line */

export default {
  name: 'twitch-provider',
  version: packageInfo.version,
  register: (server: Server) => {
    server.auth.strategy('twitch', 'bell', {
      provider: 'twitch',
      password: config.get<string>('twitch.cookiePassword'),
      isSecure: process.env.NODE_ENV === 'production',
      clientId: config.get<string>('twitch.clientId'),
      clientSecret: config.get<string>('twitch.clientSecret')
    });

    server.route({
      method: ['GET', 'POST'],
      path: '/auth/twitch',
      handler: (request: Request) => {
        if (!request.auth.isAuthenticated) {
          return Boom.unauthorized(request.auth.error.message);
        }

        const profile = (request.auth.credentials as any).profile;
        return createConnection().then(connection =>
          findDriverByExternal(connection, 'twitch', profile._id.toString()).then(driver => {
            if (!driver) {
              console.log('No driver for that account found');
            } else {
              console.log('Driver found');
            }

            return Promise.props({
              token: tokens.sign({
                profile
              })
            });
          })
        );
      },
      options: {
        cache: false,
        auth: 'twitch'
      }
    });
  }
};
