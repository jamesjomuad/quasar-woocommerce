/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 * npx knex seed:run --esm
 * npx knex migrate:rollback --esm
 *
 */
export async function seed(knex) {
  // Deletes ALL existing entries in the 'users' table and resets the primary key counter (for SQLite)
  return knex('users')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          // We combine firstName and lastName into the 'name' column based on your schema
          name: 'james jomuad',
          email: 'james.jomuad@outlook.com',
          // Use a simple placeholder password hash for seed data
          password_hash: 'placeholder_hash_123',
        },
        // You can add more seed entries here:
        {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password_hash: 'placeholder_hash_456',
        },
      ])
    })
}
