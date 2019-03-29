import Promise from 'bluebird';
import {Server} from 'hapi';
import bell from 'bell';

import jwtAuth from './jwt';

const packageInfo = require('../../../package'); /* tslint:disable-line */
const providers = ['twitch'];

export default {
  name: 'auth',
  version: packageInfo.version,
  register: (server: Server) =>
    server
      .register([bell, jwtAuth])
      .then(() =>
        Promise.mapSeries(providers, provider => {
          try {
            const providerPlugin = require(`./${provider}-provider`).default;
            return server.register(providerPlugin);
          } catch (err) {
            console.error(`Could not load '${provider}' auth provider: ${err}`);
            return Promise.resolve();
          }
        })
      )
      .then(() => Promise.resolve())
};
