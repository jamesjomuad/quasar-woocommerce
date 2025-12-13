/**
 *
 * npx knex migrate:up
 * npx knex migrate:latest --esm
 * npx knex migrate:rollback --esm
 *
 */
export async function up(knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('sku').unique().nullable()
    table.text('description').nullable()
    table.decimal('price', 10, 2).defaultTo(0)
    table.decimal('regular_price', 10, 2).nullable()
    table.decimal('sale_price', 10, 2).nullable()
    table.integer('stock_quantity').defaultTo(0)
    table.string('stock_status').defaultTo('instock')
    table.integer('category_id').unsigned().nullable()
    table.string('image').nullable()
    table.string('status').defaultTo('publish')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable().index() // For soft delete tracking
  })
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('products')
}
