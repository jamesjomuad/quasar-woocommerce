// db-connect.js - Central file to establish the Knex connection
// This version uses a NAMED EXPORT 'connect' to match the Electron main file's import.

import knex from 'knex'
import * as path from 'path' // Crucial: Must import path statically

// Define your configuration directly for application use
const dbConfig = {
  client: 'better-sqlite3',
  connection: {
    // FIX: Use path.resolve() to give Knex an ABSOLUTE path
    filename: path.resolve(process.cwd(), 'database.sqlite3'),
  },
  useNullAsDefault: true,
}

// Function that returns the initialized Knex instance
// This is the function that will be NAMED EXPORTED
export function connect() {
  try {
    const db = knex(dbConfig)
    console.log('Database client initialized successfully.')
    return db
  } catch (error) {
    console.error('Failed to initialize database client:', error)
    // You might want to handle this error more gracefully in a real app
    throw error
  }
}

export const db = knex(dbConfig)
