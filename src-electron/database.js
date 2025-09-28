const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'inventory.db'))

// Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT,
    price REAL
  );

  CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER,
    updated_at TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    type TEXT, -- IN or OUT
    quantity INTEGER,
    timestamp TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`)

module.exports = {
  getProducts() {
    return db.prepare('SELECT * FROM products').all()
  },
  addProduct(product) {
    return db
      .prepare('INSERT INTO products (name, sku, price) VALUES (?, ?, ?)')
      .run(product.name, product.sku, product.price)
  },
  recordTransaction({ product_id, type, quantity }) {
    const timestamp = new Date().toISOString()
    db.prepare(
      'INSERT INTO transactions (product_id, type, quantity, timestamp) VALUES (?, ?, ?, ?)',
    ).run(product_id, type, quantity, timestamp)

    // Update stock
    const currentStock = db
      .prepare('SELECT quantity FROM stock WHERE product_id = ?')
      .get(product_id)
    const newQty =
      type === 'IN'
        ? (currentStock?.quantity || 0) + quantity
        : (currentStock?.quantity || 0) - quantity

    if (currentStock) {
      db.prepare('UPDATE stock SET quantity = ?, updated_at = ? WHERE product_id = ?').run(
        newQty,
        timestamp,
        product_id,
      )
    } else {
      db.prepare('INSERT INTO stock (product_id, quantity, updated_at) VALUES (?, ?, ?)').run(
        product_id,
        newQty,
        timestamp,
      )
    }
  },
  getStock() {
    return db
      .prepare(
        `
      SELECT p.id, p.name, p.sku, s.quantity
      FROM products p
      LEFT JOIN stock s ON s.product_id = p.id
    `,
      )
      .all()
  },
}
