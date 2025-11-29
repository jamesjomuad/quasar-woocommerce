/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 * npx knex seed:run --esm
 *
 */
export async function seed(knex) {
  // 🚨 SQLite cannot use .truncate() normally because of foreign key constraints
  // This is the safest way to reset the table in SQLite:
  await knex('users').delete()
  await knex.raw(`DELETE FROM sqlite_sequence WHERE name='users'`)

  // Insert seed data
  return knex('users').insert([
    {
      name: 'james jomuad',
      email: 'james.jomuad@outlook.com',
      password: 'hashed(placeholder123)', // will be transformed by beforeCreate if needed
      active: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'hashed(placeholder456)',
      active: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ])
}
