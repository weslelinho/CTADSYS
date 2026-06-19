class AuditLog {
  constructor(data = {}) {
    this.id = data.id;
    this.userId = data.user_id ?? data.userId ?? null;
    this.userName = data.user_name ?? data.userName ?? null;
    this.userUsername = data.user_username ?? data.userUsername ?? null;
    this.action = data.action;
    this.entityType = data.entity_type ?? data.entityType ?? null;
    this.entityId = data.entity_id ?? data.entityId ?? null;
    this.oldValues = data.old_values ?? data.oldValues ?? null;
    this.newValues = data.new_values ?? data.newValues ?? null;
    this.ipAddress = data.ip_address ?? data.ipAddress ?? null;
    this.userAgent = data.user_agent ?? data.userAgent ?? null;
    this.createdAt = data.created_at ?? data.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      userName: this.userName,
      userUsername: this.userUsername,
      action: this.action,
      entityType: this.entityType,
      entityId: this.entityId,
      oldValues: this.parseJson(this.oldValues),
      newValues: this.parseJson(this.newValues),
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      createdAt: this.createdAt,
    };
  }

  parseJson(value) {
    if (!value) return null;
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}

module.exports = AuditLog;
