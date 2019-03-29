import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export function timestamps(pgm: MigrationBuilder, columns: ColumnDefinitions): ColumnDefinitions {
  return {
    ...columns,
    created: {type: 'timestamp without time zone', notNull: true, default: pgm.func("(now() at time zone 'utc')")},
    updated: {type: 'timestamp without time zone', notNull: true, default: pgm.func("(now() at time zone 'utc')")}
  };
}

export function updateTrigger(pgm: MigrationBuilder, table: string) {
  pgm.createTrigger(table, `${table}_record_updates`, {
    language: 'plpgsql',
    when: 'BEFORE',
    operation: 'UPDATE',
    function: 'record_updates'
  });
}
