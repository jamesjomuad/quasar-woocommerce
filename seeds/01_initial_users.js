/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 * npx knex seed:run --esm
 *
 */
import bcrypt from 'bcrypt'

export async function seed(knex) {
  // 🚨 SQLite cannot use .truncate() normally because of foreign key constraints
  // This is the safest way to reset the table in SQLite:
  await knex('users').delete()
  await knex.raw(`DELETE FROM sqlite_sequence WHERE name='users'`)

  // Hash password
  const password = await bcrypt.hash('admin', 10)

  // Insert seed data
  return knex('users').insert([
    {
      name: 'james jomuad',
      email: 'james.jomuad@outlook.com',
      password: password,
      active: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])
}
