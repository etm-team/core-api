import Promise from 'bluebird';
import Pgp, {IDatabase} from 'pg-promise';
import config from 'config';

export const pgp = Pgp({
  capSQL: true,
  promiseLib: Promise
});

export default function(): Promise<IDatabase<{}>> {
  return Promise.resolve(pgp(config.get('database.url')));
}
