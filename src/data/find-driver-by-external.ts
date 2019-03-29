import {IDatabase} from 'pg-promise';

export interface Driver {
  id: string;
  name: string;
  nickname: string;
  timezone: string;
  preferences: string[];
}

const FindDriverByExternalSql = `
SELECT
  id,
  name,
  nickname,
  timezone,
  preferences
FROM
  driver d
  INNER JOIN driver_external_account dea ON d.id = dea.driver_id
WHERE
  LOWER(dea.account_provider) = LOWER($[accountProvider]) AND
  dea.external_id = $[externalId];
`;

export default function(
  connection: IDatabase<{}>,
  accountProvider: string,
  externalId: string
): Promise<Driver | null> {
  return Promise.resolve(
    connection.oneOrNone(FindDriverByExternalSql, {accountProvider, externalId}).then(result => {
      if (!result) {
        return null;
      }

      return result as Driver;
    })
  );
}
