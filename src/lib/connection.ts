import Promise from 'bluebird';
import Pgp, {IDatabase} from 'pg-promise';

export const pgp = Pgp({
  capSQL: true,
  promiseLib: Promise
});

const connectionString = '';
export default function(config): Promise<IDatabase<{}>> {
  return pgp(connectionString);
}
