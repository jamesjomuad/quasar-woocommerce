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
    table.string('username').unique().notNullable()
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.string('email').unique().notNullable()
    table.string('phone').unique().notNullable()
    table.string('password', 255).notNullable()
    table.boolean('active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable().index() // For soft delete tracking
  })
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('users')
}
