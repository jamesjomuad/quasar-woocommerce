/**
 *
 * npx knex migrate:up
 * npx knex migrate:latest --esm
 * npx knex migrate:rollback --esm
 *
 */
export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()

    table.string('name').notNullable()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()

    table.boolean('active').defaultTo(true)

    // Laravel-style timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    // Soft delete (Laravel-style)
    table.timestamp('deleted_at').nullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('users')
}
