import { Model } from './Model.js'

class Product extends Model {
  constructor() {
    super('products')

    this.fillable = [
      'name',
      'sku',
      'description',
      'price',
      'regular_price',
      'sale_price',
      'stock_quantity',
      'stock_status',
      'category_id',
      'image',
      'status'
    ]

    this.casts = {
      id: 'int',
      price: 'float',
      regular_price: 'float',
      sale_price: 'float',
      stock_quantity: 'int',
      created_at: 'date',
      updated_at: 'date'
    }
  }

  // Scopes
  inStock(q) {
    return q.where('stock_status', 'instock')
  }

  published(q) {
    return q.where('status', 'publish')
  }

  // Events
  async beforeCreate(data) {
    // Set default values
    if (!data.stock_status) {
      data.stock_status = 'instock'
    }
    if (!data.status) {
      data.status = 'publish'
    }
    return data
  }
}

export default new Product()
