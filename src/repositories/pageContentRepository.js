const { db } = require('../config/database');
const PageContent = require('../models/PageContent');

const pageContentRepository = {
  findAll() {
    const rows = db
      .prepare(
        `SELECT id, content_key, section, label, content, updated_by, updated_at
         FROM page_contents
         ORDER BY id ASC`
      )
      .all();
    return rows.map((row) => new PageContent(row));
  },

  findByKey(key) {
    const row = db
      .prepare('SELECT * FROM page_contents WHERE content_key = ?')
      .get(key);
    return row ? new PageContent(row) : null;
  },

  updateContent(key, content, userId) {
    const result = db
      .prepare(
        `UPDATE page_contents
         SET content = ?, updated_by = ?, updated_at = datetime('now')
         WHERE content_key = ?`
      )
      .run(content, userId, key);

    if (result.changes === 0) return null;
    return this.findByKey(key);
  },

  updateMany(updates, userId) {
    const updateStmt = db.prepare(
      `UPDATE page_contents
       SET content = ?, updated_by = ?, updated_at = datetime('now')
       WHERE content_key = ?`
    );

    const updateMany = db.transaction((items) => {
      const updated = [];
      items.forEach(({ key, content }) => {
        const result = updateStmt.run(content, userId, key);
        if (result.changes > 0) {
          updated.push(this.findByKey(key));
        }
      });
      return updated;
    });

    return updateMany(updates);
  },
};

module.exports = pageContentRepository;
