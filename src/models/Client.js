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
    this.exitDate = data.data_saida || data.exitDate || null;
    this.status = data.status || 'ativo';
    this.notes = data.notes;
    this.photoPath = data.photo_path || data.photoPath || null;
    this.rg = data.rg || null;
    this.orgaoExpedidor = data.orgao_expedidor || data.orgaoExpedidor || null;
    this.dataEmissao = data.data_emissao || data.dataEmissao || null;
    this.tituloEleitor = data.titulo_eleitor || data.tituloEleitor || null;
    this.profissao = data.profissao || null;
    this.escolaridade = data.escolaridade || null;
    this.estadoCivil = data.estado_civil || data.estadoCivil || null;
    this.filiacaoPai = data.filiacao_pai || data.filiacaoPai || null;
    this.filiacaoMae = data.filiacao_mae || data.filiacaoMae || null;
    this.naturalidade = data.naturalidade || null;
    this.sexo = data.sexo || null;
    this.trabalha =
      data.trabalha === undefined || data.trabalha === null ? null : Boolean(data.trabalha);
    this.numeroFilhos =
      data.numero_filhos !== undefined && data.numero_filhos !== null
        ? data.numero_filhos
        : data.numeroFilhos !== undefined && data.numeroFilhos !== null
          ? data.numeroFilhos
          : null;
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
      exitDate: this.exitDate,
      status: this.status,
      notes: this.notes,
      photoPath: this.photoPath,
      rg: this.rg,
      orgaoExpedidor: this.orgaoExpedidor,
      dataEmissao: this.dataEmissao,
      tituloEleitor: this.tituloEleitor,
      profissao: this.profissao,
      escolaridade: this.escolaridade,
      estadoCivil: this.estadoCivil,
      filiacaoPai: this.filiacaoPai,
      filiacaoMae: this.filiacaoMae,
      naturalidade: this.naturalidade,
      sexo: this.sexo,
      trabalha: this.trabalha,
      numeroFilhos: this.numeroFilhos,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Client;
