// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  development: {
    client: 'better-sqlite3',
    connection: {
      // The database file path relative to your project root for CLI use.
      filename: './dev_database.sqlite3',
    },
    useNullAsDefault: true, // Recommended for SQLite
    migrations: {
      directory: './migrations', // Where your migration files live
      // IMPORTANT: Tell Knex to also load .cjs files
      loadExtensions: ['.js', '.cjs'],
    },
    seeds: {
      directory: './seeds', // Where your seed files live
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}

export default config
