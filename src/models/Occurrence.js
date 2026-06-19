class Occurrence {
  constructor(data = {}) {
    this.id = data.id;
    this.clientId = data.client_id || data.clientId;
    this.clientName = data.client_name || data.clientName;
    this.description = data.description;
    this.occurredAt = data.occurred_at || data.occurredAt;
    this.createdBy = data.created_by || data.createdBy;
    this.createdAt = data.created_at || data.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      clientId: this.clientId,
      clientName: this.clientName,
      description: this.description,
      occurredAt: this.occurredAt,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Occurrence;
