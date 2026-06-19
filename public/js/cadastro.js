let clients = [];
let editingId = null;
let deletingId = null;
let pendingPhotoFile = null;
let photoRemoved = false;
let currentPhotoPath = null;
let cameraStream = null;

const form = document.getElementById('client-form');
const formTitle = document.getElementById('form-title');
const formAlert = document.getElementById('form-alert');
const submitBtn = document.getElementById('submit-btn');
const searchInput = document.getElementById('search-input');
const tbody = document.getElementById('clients-tbody');
const modal = document.getElementById('patient-modal');
const deleteModal = document.getElementById('delete-patient-modal');
const deleteConfirmMessage = document.getElementById('delete-confirm-message');
const deleteAlert = document.getElementById('delete-alert');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const newPatientBtn = document.getElementById('new-patient-btn');

const photoFileInput = document.getElementById('photo-file-input');
const photoFileBtn = document.getElementById('photo-file-btn');
const photoCameraBtn = document.getElementById('photo-camera-btn');
const photoRemoveBtn = document.getElementById('photo-remove-btn');
const photoPreviewImg = document.getElementById('photo-preview-img');
const photoPlaceholder = document.getElementById('photo-placeholder');

const cameraModal = document.getElementById('camera-modal');
const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const cameraCaptureBtn = document.getElementById('camera-capture-btn');
const cameraAlert = document.getElementById('camera-alert');

document.addEventListener('DOMContentLoaded', async () => {
  await loadClients();

  form.addEventListener('submit', handleSubmit);
  searchInput.addEventListener('input', renderClients);
  tbody.addEventListener('click', handleTableClick);
  newPatientBtn.addEventListener('click', openNewPatientModal);
  confirmDeleteBtn.addEventListener('click', confirmDeletePatient);

  document.getElementById('cpf').addEventListener('input', formatCpf);
  document.getElementById('phone').addEventListener('input', formatPhone);

  photoFileBtn.addEventListener('click', () => photoFileInput.click());
  photoFileInput.addEventListener('change', handlePhotoFileSelect);
  photoCameraBtn.addEventListener('click', openCameraModal);
  photoRemoveBtn.addEventListener('click', removePhoto);
  cameraCaptureBtn.addEventListener('click', capturePhoto);

  modal.querySelectorAll('[data-close-patient-modal]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  deleteModal.querySelectorAll('[data-close-delete-modal]').forEach((el) => {
    el.addEventListener('click', closeDeleteModal);
  });

  cameraModal.querySelectorAll('[data-close-camera-modal]').forEach((el) => {
    el.addEventListener('click', closeCameraModal);
  });
});

async function loadClients() {
  try {
    const res = await fetch('/api/clients');
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();
    clients = data.clients;
    renderClients();
  } catch {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state"><p>Erro ao carregar pacientes.</p></div>
      </td></tr>`;
  }
}

function getPhotoUrl(photoPath) {
  if (!photoPath) return null;
  return `/uploads/${photoPath}`;
}

function renderPhotoThumb(photoPath) {
  if (photoPath) {
    return `<img class="patient-photo-thumb" src="${getPhotoUrl(photoPath)}" alt="">`;
  }
  return `<span class="patient-photo-thumb patient-photo-thumb--empty">👤</span>`;
}

function renderClients() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = clients.filter((c) => {
    if (!query) return true;
    return (
      c.fullName.toLowerCase().includes(query) ||
      (c.cpf && c.cpf.includes(query)) ||
      (c.phone && c.phone.includes(query))
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state">
          <div class="empty-state__icon">📋</div>
          <p>${query ? 'Nenhum paciente encontrado.' : 'Nenhum paciente cadastrado ainda.'}</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (c) => `
    <tr>
      <td>${renderPhotoThumb(c.photoPath)}<strong>${Admin.escapeHtml(c.fullName)}</strong></td>
      <td>${Admin.escapeHtml(c.cpf || '—')}</td>
      <td>${Admin.escapeHtml(c.phone || '—')}</td>
      <td>${Admin.formatDate(c.admissionDate)}</td>
      <td><span class="status-badge status-badge--${c.status}">${capitalize(c.status)}</span></td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn btn--outline btn--sm" data-action="edit" data-id="${c.id}">Editar</button>
          <button type="button" class="btn btn--danger btn--sm" data-action="delete" data-id="${c.id}">Excluir</button>
        </div>
      </td>
    </tr>`
    )
    .join('');
}

function fillPatientForm(client) {
  document.getElementById('client-id').value = client.id || '';
  document.getElementById('fullName').value = client.fullName || '';
  document.getElementById('cpf').value = client.cpf || '';
  document.getElementById('birthDate').value = client.birthDate || '';
  document.getElementById('phone').value = client.phone || '';
  document.getElementById('email').value = client.email || '';
  document.getElementById('address').value = client.address || '';
  document.getElementById('city').value = client.city || '';
  document.getElementById('state').value = client.state || '';
  document.getElementById('admissionDate').value = client.admissionDate || '';
  document.getElementById('status').value = client.status || 'ativo';
  document.getElementById('notes').value = client.notes || '';
  setPhotoPreview(client.photoPath);
}

function setPhotoPreview(photoPath) {
  currentPhotoPath = photoPath || null;
  pendingPhotoFile = null;
  photoRemoved = false;
  photoFileInput.value = '';

  if (photoPath) {
    photoPreviewImg.src = getPhotoUrl(photoPath);
    photoPreviewImg.hidden = false;
    photoPlaceholder.hidden = true;
    photoRemoveBtn.hidden = false;
  } else {
    photoPreviewImg.src = '';
    photoPreviewImg.hidden = true;
    photoPlaceholder.hidden = false;
    photoRemoveBtn.hidden = true;
  }
}

function showLocalPhotoPreview(file) {
  const url = URL.createObjectURL(file);
  photoPreviewImg.src = url;
  photoPreviewImg.hidden = false;
  photoPlaceholder.hidden = true;
  photoRemoveBtn.hidden = false;
  photoPreviewImg.onload = () => URL.revokeObjectURL(url);
}

function handlePhotoFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showAlert('Selecione um arquivo de imagem válido.', 'error');
    photoFileInput.value = '';
    return;
  }

  pendingPhotoFile = file;
  photoRemoved = false;
  showLocalPhotoPreview(file);
}

function removePhoto() {
  pendingPhotoFile = null;
  photoFileInput.value = '';
  photoRemoved = Boolean(currentPhotoPath);
  photoPreviewImg.src = '';
  photoPreviewImg.hidden = true;
  photoPlaceholder.hidden = false;
  photoRemoveBtn.hidden = true;
}

function resetPhotoState() {
  pendingPhotoFile = null;
  photoRemoved = false;
  currentPhotoPath = null;
  photoFileInput.value = '';
  photoPreviewImg.src = '';
  photoPreviewImg.hidden = true;
  photoPlaceholder.hidden = false;
  photoRemoveBtn.hidden = true;
}

async function openCameraModal() {
  hideCameraAlert();
  cameraModal.classList.add('modal--open');
  cameraModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false,
    });
    cameraVideo.srcObject = cameraStream;
  } catch {
    showCameraAlert('Não foi possível acessar a câmera. Verifique as permissões do navegador.', 'error');
    cameraCaptureBtn.disabled = true;
  }
}

function closeCameraModal() {
  stopCamera();
  cameraModal.classList.remove('modal--open');
  cameraModal.setAttribute('aria-hidden', 'true');
  cameraCaptureBtn.disabled = false;
  hideCameraAlert();
  if (!modal.classList.contains('modal--open') && !deleteModal.classList.contains('modal--open')) {
    document.body.classList.remove('modal-open');
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraVideo.srcObject = null;
}

function capturePhoto() {
  const width = cameraVideo.videoWidth;
  const height = cameraVideo.videoHeight;
  if (!width || !height) return;

  cameraCanvas.width = width;
  cameraCanvas.height = height;
  cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0, width, height);

  cameraCanvas.toBlob(
    (blob) => {
      if (!blob) return;
      pendingPhotoFile = new File([blob], `captura-${Date.now()}.jpg`, { type: 'image/jpeg' });
      photoRemoved = false;
      showLocalPhotoPreview(pendingPhotoFile);
      closeCameraModal();
    },
    'image/jpeg',
    0.9
  );
}

async function uploadPhoto(clientId) {
  if (!pendingPhotoFile) return null;

  const formData = new FormData();
  formData.append('photo', pendingPhotoFile);

  const res = await fetch(`/api/clients/${clientId}/photo`, {
    method: 'POST',
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erro ao enviar foto');
  return result.client;
}

async function deletePhotoOnServer(clientId) {
  const res = await fetch(`/api/clients/${clientId}/photo`, { method: 'DELETE' });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erro ao remover foto');
  return result.client;
}

function openModal() {
  modal.classList.add('modal--open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('modal--open');
  modal.setAttribute('aria-hidden', 'true');
  if (!deleteModal.classList.contains('modal--open') && !cameraModal.classList.contains('modal--open')) {
    document.body.classList.remove('modal-open');
  }
  resetForm();
}

function handleTableClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (btn.dataset.action === 'edit') editClient(id);
  if (btn.dataset.action === 'delete') openDeleteModal(id);
}

function openDeleteModal(id) {
  const client = clients.find((c) => c.id === id);
  if (!client) return;

  deletingId = id;
  deleteConfirmMessage.textContent = `Tem certeza que deseja excluir o paciente "${client.fullName}"?`;
  hideDeleteAlert();
  deleteModal.classList.add('modal--open');
  deleteModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeDeleteModal() {
  deleteModal.classList.remove('modal--open');
  deleteModal.setAttribute('aria-hidden', 'true');
  deletingId = null;
  hideDeleteAlert();
  if (!modal.classList.contains('modal--open') && !cameraModal.classList.contains('modal--open')) {
    document.body.classList.remove('modal-open');
  }
}

function openNewPatientModal() {
  resetForm();
  formTitle.textContent = 'Novo Paciente';
  openModal();
}

async function editClient(id) {
  hideAlert();
  formTitle.textContent = 'Editar Paciente';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Carregando...';
  openModal();

  try {
    const res = await fetch(`/api/clients/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Paciente não encontrado');

    editingId = id;
    fillPatientForm(data.client);
  } catch (err) {
    closeModal();
    alert(err.message);
    return;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Salvar';
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  hideAlert();

  const data = getFormData();
  if (!data.fullName.trim()) {
    showAlert('Nome completo é obrigatório.', 'error');
    return;
  }

  const isEditing = Boolean(editingId);
  submitBtn.disabled = true;
  submitBtn.textContent = 'Salvando...';

  try {
    const url = isEditing ? `/api/clients/${editingId}` : '/api/clients';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao salvar');

    let savedClient = result.client;

    if (pendingPhotoFile) {
      savedClient = await uploadPhoto(savedClient.id);
    } else if (isEditing && photoRemoved) {
      savedClient = await deletePhotoOnServer(savedClient.id);
    }

    if (isEditing) {
      const idx = clients.findIndex((c) => c.id === editingId);
      clients[idx] = savedClient;
    } else {
      clients.unshift(savedClient);
    }

    renderClients();
    closeModal();
  } catch (err) {
    showAlert(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Salvar';
  }
}

async function confirmDeletePatient() {
  if (!deletingId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Excluindo...';
  hideDeleteAlert();

  try {
    const res = await fetch(`/api/clients/${deletingId}`, { method: 'DELETE' });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || 'Erro ao excluir');
    }

    clients = clients.filter((c) => c.id !== deletingId);
    renderClients();
    if (editingId === deletingId) closeModal();
    closeDeleteModal();
  } catch (err) {
    showDeleteAlert(err.message, 'error');
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Excluir paciente';
  }
}

function getFormData() {
  return {
    fullName: document.getElementById('fullName').value.trim(),
    cpf: document.getElementById('cpf').value.trim() || null,
    birthDate: document.getElementById('birthDate').value || null,
    phone: document.getElementById('phone').value.trim() || null,
    email: document.getElementById('email').value.trim() || null,
    address: document.getElementById('address').value.trim() || null,
    city: document.getElementById('city').value.trim() || null,
    state: document.getElementById('state').value.trim().toUpperCase() || null,
    admissionDate: document.getElementById('admissionDate').value || null,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value.trim() || null,
  };
}

function resetForm() {
  editingId = null;
  form.reset();
  document.getElementById('client-id').value = '';
  formTitle.textContent = 'Novo Paciente';
  submitBtn.textContent = 'Salvar';
  hideAlert();
  resetPhotoState();
}

function showAlert(message, type) {
  formAlert.textContent = message;
  formAlert.className = `alert alert--visible alert--${type}`;
}

function hideAlert() {
  formAlert.className = 'alert';
}

function showCameraAlert(message, type) {
  cameraAlert.textContent = message;
  cameraAlert.className = `alert alert--visible alert--${type}`;
}

function hideCameraAlert() {
  cameraAlert.className = 'alert';
}

function showDeleteAlert(message, type) {
  deleteAlert.textContent = message;
  deleteAlert.className = `alert alert--visible alert--${type}`;
}

function hideDeleteAlert() {
  deleteAlert.className = 'alert';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCpf(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  e.target.value = v;
}

function formatPhone(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
  else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  e.target.value = v;
}
