import knex from 'knex'
import path from 'node:path'

export const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: path.resolve(process.cwd(), 'data.sqlite'),
  },
  useNullAsDefault: true,
})
