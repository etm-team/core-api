import {MigrationBuilder} from 'node-pg-migrate';

import {timestamps, updateTrigger} from '../lib/migrations';

exports.up = (pgm: MigrationBuilder) => {
  pgm.createExtension('uuid-ossp', {ifNotExists: true});

  pgm.createFunction(
    'record_updates',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql',
      replace: true
    },
    `
BEGIN
  IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
    NEW.updated = now() at time zone 'utc';
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
`
  );

  pgm.createTable(
    'driver',
    timestamps(pgm, {
      id: {type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('uuid_generate_v4()')},
      name: {type: 'text', notNull: true},
      nickname: {type: 'text', notNull: true},
      timezone: {type: 'text', notNull: true},
      preferences: {type: 'text[]', notNull: true, default: pgm.func('array[]::text[]')},
      icons: {type: 'jsonb'}
    })
  );
  updateTrigger(pgm, 'driver');
  pgm.createIndex('driver', 'name');
  pgm.createIndex('driver', 'nickname', {unique: true});

  pgm.createTable(
    'driver_external_account',
    timestamps(pgm, {
      driver_id: {type: 'uuid', notNull: true, references: 'driver(id)', onDelete: 'CASCADE'},
      account_provider: {type: 'text', notNull: true},
      external_id: {type: 'text', notNull: true}
    })
  );
  updateTrigger(pgm, 'driver_external_account');
  pgm.createIndex('driver_external_account', ['account_provider', 'external_id'], {unique: true});

  pgm.createTable(
    'team',
    timestamps(pgm, {
      id: {type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('uuid_generate_v4()')},
      name: {type: 'text', notNull: true}
    })
  );
  updateTrigger(pgm, 'team');

  pgm.createTable(
    'team_driver',
    timestamps(pgm, {
      team_id: {type: 'uuid', notNull: true, references: 'team(id)', onDelete: 'CASCADE'},
      driver_id: {type: 'uuid', notNull: true, references: 'driver(id)', onDelete: 'CASCADE'},
      permissions: {type: 'text[]', notNull: true, default: pgm.func('array[]::text[]')}
    })
  );
  updateTrigger(pgm, 'team_driver');
  pgm.createIndex('team_driver', ['team_id', 'driver_id'], {unique: true});
};

exports.down = (pgm: MigrationBuilder) => {
  pgm.dropTable('team_driver');
  pgm.dropTable('team');
  pgm.dropTable('driver_external_account');
  pgm.dropTable('driver');

  pgm.dropFunction('record_updates', []);
};
