import {ServerRoute} from 'hapi';

const route: ServerRoute = {
  method: 'GET',
  path: '/status',
  options: {
    auth: false,
    handler: getStatus,
    tags: ['health']
  }
};

function getStatus() {
  return {
    status: 'Ok'
  };
}

export default route;
