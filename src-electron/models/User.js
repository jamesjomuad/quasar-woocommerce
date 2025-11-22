import { connect } from '../db-connect.js'

// Get the Knex instance once
const db = connect()
const TABLE_NAME = 'users'

/**
 * Repository class for all 'users' table operations.
 * This abstracts the raw Knex queries away from the application's business logic.
 */
class User {
  /**
   * Retrieves all users from the database.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects.
   */
  static async findAll() {
    // Knex Query Builder syntax (acts like an ORM):
    // knex('table_name').select('columns').where('conditions')
    return db(TABLE_NAME).select('id', 'name', 'email', 'created_at')
  }

  /**
   * Finds a single user by their ID.
   * @param {number} id - The primary key of the user.
   * @returns {Promise<Object | undefined>} A promise that resolves to the user object or undefined.
   */
  static async findById(id) {
    return db(TABLE_NAME).where({ id }).first()
  }

  /**
   * Creates a new user record.
   * @param {Object} userData - Object containing name and email.
   * @returns {Promise<number[]>} A promise that resolves to an array of inserted IDs.
   */
  static async create(userData) {
    const { name, email, password_hash } = userData

    // Knex insert: returns an array of IDs for the inserted records.
    return db(TABLE_NAME).insert({
      name,
      email,
      password_hash,
      // knex.fn.now() can also be used here if not defaulted in the migration
    })
  }

  /**
   * Updates an existing user's data.
   * @param {number} id - The ID of the user to update.
   * @param {Object} updates - Object containing fields to update.
   * @returns {Promise<number>} A promise that resolves to the number of rows updated (1 or 0).
   */
  static async update(id, updates) {
    // The .update() returns the number of affected rows.
    return db(TABLE_NAME)
      .where({ id })
      .update({
        ...updates,
        updated_at: db.fn.now(), // Set updated_at timestamp
      })
  }

  /**
   * Deletes a user record by ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<number>} A promise that resolves to the number of rows deleted (1 or 0).
   */
  static async delete(id) {
    return db(TABLE_NAME).where({ id }).del()
  }
}

export default User
