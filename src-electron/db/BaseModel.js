import { db } from './knex.js'

export class BaseModel {
  constructor(table) {
    this.table = table

    // Laravel-style features
    this.fillable = []
    this.hidden = []
    this.casts = {} // { field: 'boolean' | 'int' | 'float' | 'date' }

    this.timestamps = true
    this.softDelete = true

    this.globalScopes = []
  }

  // ---------------------------------------
  // Core Query Builder
  // ---------------------------------------
  query() {
    let q = db(this.table)

    // Apply softDeletes
    if (this.softDelete) {
      q = q.whereNull(`${this.table}.deleted_at`)
    }

    // Apply global scopes
    for (const scope of this.globalScopes) {
      q = scope(q)
    }

    return q
  }

  // ---------------------------------------
  // CRUD
  // ---------------------------------------
  async all() {
    const rows = await this.query().select('*')
    return rows.map((r) => this.transform(r))
  }

  async find(id) {
    const row = await this.query().where({ id }).first()
    return row ? this.transform(row) : null
  }

  async create(data) {
    const filtered = this.filterFillable(data)
    const now = new Date().toISOString()

    if (this.timestamps) {
      filtered.created_at = now
      filtered.updated_at = now
    }

    await this.beforeCreate(filtered)

    const ids = await db(this.table).insert(filtered)
    const result = await this.find(ids[0])

    await this.afterCreate(result)
    return result
  }

  async update(id, data) {
    const filtered = this.filterFillable(data)
    const now = new Date().toISOString()

    if (this.timestamps) {
      filtered.updated_at = now
    }

    await this.beforeUpdate(id, filtered)

    await db(this.table).where({ id }).update(filtered)
    const result = await this.find(id)

    await this.afterUpdate(result)
    return result
  }

  async delete(id) {
    await this.beforeDelete(id)

    if (this.softDelete) {
      await db(this.table).where({ id }).update({
        deleted_at: new Date().toISOString(),
      })
    } else {
      await db(this.table).where({ id }).delete()
    }

    await this.afterDelete(id)
  }

  async forceDelete(id) {
    return db(this.table).where({ id }).delete()
  }

  // ---------------------------------------
  // Laravel-style Utility
  // ---------------------------------------
  filterFillable(data) {
    if (!this.fillable.length) return data

    const filtered = {}
    for (const key of this.fillable) {
      if (key in data) filtered[key] = data[key]
    }
    return filtered
  }

  castValue(type, value) {
    if (value === null || value === undefined) return value

    switch (type) {
      case 'int':
      case 'integer':
        return parseInt(value)
      case 'float':
      case 'double':
        return parseFloat(value)
      case 'boolean':
        return !!value
      case 'date':
      case 'datetime':
        return new Date(value)
      default:
        return value
    }
  }

  transform(row) {
    // copy
    const obj = { ...row }

    // casts
    for (const key in this.casts) {
      if (key in obj) {
        obj[key] = this.castValue(this.casts[key], obj[key])
      }
    }

    // hidden fields
    this.hidden.forEach((h) => delete obj[h])

    return obj
  }

  // ---------------------------------------
  // Pagination
  // ---------------------------------------
  async paginate(page = 1, perPage = 10) {
    const offset = (page - 1) * perPage

    const total = await this.query().count({ count: '*' }).first()
    const data = await this.query().limit(perPage).offset(offset)

    return {
      data: data.map((d) => this.transform(d)),
      page,
      perPage,
      total: total.count,
      lastPage: Math.ceil(total.count / perPage),
    }
  }

  // ---------------------------------------
  // Scopes
  // ---------------------------------------
  addGlobalScope(fn) {
    this.globalScopes.push(fn)
  }

  scope(fn) {
    return fn(this.query())
  }

  // ---------------------------------------
  // Relationships
  // ---------------------------------------
  hasMany(modelClass, foreignKey, localKey = 'id') {
    const model = new modelClass()
    return model.query().where(foreignKey, this[localKey])
  }

  hasOne(modelClass, foreignKey, localKey = 'id') {
    const model = new modelClass()
    return model.query().where(foreignKey, this[localKey]).first()
  }

  belongsTo(modelClass, foreignKey, ownerKey = 'id') {
    const model = new modelClass()
    return model.query().where(ownerKey, this[foreignKey]).first()
  }

  // ---------------------------------------
  // Events (Can be overridden in child model)
  // ---------------------------------------
  // async beforeCreate(data) {}
  // async afterCreate(model) {}

  // async beforeUpdate(id, data) {}
  // async afterUpdate(model) {}

  // async beforeDelete(id) {}
  // async afterDelete(id) {}
}
