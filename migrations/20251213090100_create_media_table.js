/**
 * Media table migration
 *
 * npx knex migrate:up
 * npx knex migrate:latest --esm
 * npx knex migrate:rollback --esm
 *
 */
export async function up(knex) {
  return knex.schema.createTable('media', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('original_name').notNullable()
    table.string('filename').notNullable().unique()
    table.string('path').notNullable()
    table.string('url').notNullable()
    table.string('mime_type').notNullable()
    table.string('type').notNullable() // image, video, audio, document
    table.string('extension').notNullable()
    table.integer('size').unsigned().notNullable() // File size in bytes
    table.integer('width').unsigned().nullable() // For images
    table.integer('height').unsigned().nullable() // For images
    table.text('alt_text').nullable()
    table.text('caption').nullable()
    table.text('description').nullable()
    table.json('metadata').nullable() // Additional metadata as JSON
    table.integer('user_id').unsigned().nullable() // Who uploaded it
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable().index() // For soft delete tracking

    // Indexes for common queries
    table.index('type')
    table.index('mime_type')
    table.index('user_id')
  })
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('media')
}
