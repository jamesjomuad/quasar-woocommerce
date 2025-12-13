import { Model } from './Model.js'

class Media extends Model {
  constructor() {
    super('media')

    this.fillable = [
      'name',
      'original_name',
      'filename',
      'path',
      'url',
      'mime_type',
      'type',
      'extension',
      'size',
      'width',
      'height',
      'alt_text',
      'caption',
      'description',
      'metadata',
      'user_id'
    ]

    this.casts = {
      id: 'int',
      size: 'int',
      width: 'int',
      height: 'int',
      user_id: 'int',
      created_at: 'date',
      updated_at: 'date'
    }
  }

  // Scopes
  images(q) {
    return q.where('type', 'image')
  }

  videos(q) {
    return q.where('type', 'video')
  }

  audio(q) {
    return q.where('type', 'audio')
  }

  documents(q) {
    return q.where('type', 'document')
  }

  byUser(q, userId) {
    return q.where('user_id', userId)
  }

  // Get media by type
  async getAllByType(type) {
    return this.query().where('type', type).select('*')
  }

  // Search media by name
  async search(keyword) {
    return this.query()
      .where('name', 'like', `%${keyword}%`)
      .orWhere('original_name', 'like', `%${keyword}%`)
      .select('*')
  }

  // Get media type from mime type
  static getTypeFromMime(mimeType) {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    return 'document'
  }

  // Events
  async beforeCreate(data) {
    // Ensure type is set based on mime_type
    if (!data.type && data.mime_type) {
      data.type = Media.getTypeFromMime(data.mime_type)
    }
    return data
  }
}

export default new Media()
