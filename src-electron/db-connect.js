const path = require('path')
const { app } = require('electron') // Electron app module for paths
const knex = require('knex')

const DB_FILENAME = 'database.sqlite3'

function connect() {
  // Use Electron's userData path for cross-platform stability
  const dbPath = path.join(app.getPath('userData'), DB_FILENAME)

  console.log(`Attempting to connect to database at: ${dbPath}`)

  // Create the Knex instance
  const db = knex({
    client: 'better-sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
  })

  return db
}

module.exports = {
  connect,
}
