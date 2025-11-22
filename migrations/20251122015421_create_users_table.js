/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // 'up' function is for applying the migration (creating the table)
  // We use 'await' here with the modern async function export (ESM standard)
  await knex.schema.createTable('users', (table) => {
    // Primary Key: Auto-incrementing integer ID
    table.increments('id').primary()

    // User data fields
    table.string('name', 255).notNullable()
    table.string('email', 255).notNullable().unique()
    table.string('password_hash', 255)

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // 'down' function is for reversing the migration (dropping the table)
  await knex.schema.dropTableIfExists('users')
}
