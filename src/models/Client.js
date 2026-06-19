class Client {
  constructor(data = {}) {
    this.id = data.id;
    this.fullName = data.full_name || data.fullName;
    this.cpf = data.cpf;
    this.birthDate = data.birth_date || data.birthDate;
    this.phone = data.phone;
    this.email = data.email;
    this.address = data.address;
    this.city = data.city;
    this.state = data.state;
    this.admissionDate = data.admission_date || data.admissionDate;
    this.status = data.status || 'ativo';
    this.notes = data.notes;
    this.photoPath = data.photo_path || data.photoPath || null;
    this.hidden = Boolean(data.hidden);
    this.createdBy = data.created_by || data.createdBy;
    this.createdAt = data.created_at || data.createdAt;
    this.updatedAt = data.updated_at || data.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      fullName: this.fullName,
      cpf: this.cpf,
      birthDate: this.birthDate,
      phone: this.phone,
      email: this.email,
      address: this.address,
      city: this.city,
      state: this.state,
      admissionDate: this.admissionDate,
      status: this.status,
      notes: this.notes,
      photoPath: this.photoPath,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Client;
