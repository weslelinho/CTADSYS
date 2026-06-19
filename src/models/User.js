class User {
  constructor(data = {}) {
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role || 'user';
    this.createdAt = data.created_at || data.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
