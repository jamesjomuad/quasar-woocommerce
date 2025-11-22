/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 * npx knex migrate:latest --esm
 */
exports.up = function (knex) {
  // 'up' function is for applying the migration (creating the table)
  return knex.schema.createTable('users', (table) => {
    // Primary Key: Auto-incrementing integer ID
    table.increments('id').primary()

    // User data fields
    table.string('name', 255).notNullable()
    table.string('email', 255).notNullable().unique()
    table.string('password_hash', 255) // We can add a password field for authentication later

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // 'down' function is for reversing the migration (dropping the table)
  return knex.schema.dropTableIfExists('users')
}
