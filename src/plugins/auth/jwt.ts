import {Request, Server} from 'hapi';
import jwtAuth from 'hapi-auth-jwt2';
import tokens from '../../lib/tokens';

const packageInfo = require('../../../package'); /* tslint:disable-line */

function validate(decoded: any, request: Request) {
  return Promise.resolve({
    isValid: true
  });
}

export default {
  name: 'jwt-auth',
  version: packageInfo.version,
  register: (server: Server) =>
    server
      .register(jwtAuth)
      .then(() => tokens.getMaterial())
      .then(material => {
        server.auth.strategy('jwt', 'jwt', {
          key: material,
          validate,
          verifyOptions: {
            algorithm: tokens.getAlgorithm()
          }
        });

        server.auth.default('jwt');
      })
};
