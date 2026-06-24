class PageContent {
  constructor(data = {}) {
    this.id = data.id;
    this.key = data.content_key || data.key;
    this.section = data.section;
    this.label = data.label;
    this.content = data.content ?? '';
    this.updatedBy = data.updated_by ?? data.updatedBy ?? null;
    this.updatedAt = data.updated_at || data.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      key: this.key,
      section: this.section,
      label: this.label,
      content: this.content,
      updatedBy: this.updatedBy,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = PageContent;
