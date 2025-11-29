import knex from 'knex'
import * as path from 'path' // Crucial: Must import path statically

const dbConfig = {
  client: 'better-sqlite3',
  connection: {
    filename: path.resolve(process.cwd(), 'database.sqlite3'),
  },
  useNullAsDefault: true,
}

export function connect() {
  try {
    const db = knex(dbConfig)
    console.log('Database client initialized successfully.')
    return db
  } catch (error) {
    console.error('Failed to initialize database client:', error)
    throw error
  }
}

export const db = knex(dbConfig)
