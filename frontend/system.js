const STORAGE_KEY = 'descanso-eterno-demo-v1';
const SESSION_KEY = 'descanso-eterno-session';

const seed = {
  clients: [
    { id: 'CL-001', funnelStage: 'Entrante', name: 'María Fernanda Rojas', document: '45781236', phone: '+51987654210', email: 'maria.rojas@example.com', address: 'Av. España 1234, Trujillo, Perú', serviceId: 'SV-001', source: 'Recomendación', contactMethod: 'WhatsApp', created: '2026-10-03', photo: '' },
    { id: 'CL-002', funnelStage: 'Interesado', name: 'Antonio Salazar', document: '42156987', phone: '+51965114820', email: 'antonio.salazar@example.com', address: 'Av. América Sur 2450, Trujillo, Perú', serviceId: 'SV-002', source: 'Google', contactMethod: 'Llamada', created: '2026-10-04', photo: '' }
  ],
  deceased: [
    { id: 'FA-001', name: 'Carlos Alberto Rojas', document: '18112456', deathDate: '2026-10-03', clientId: 'CL-001' },
    { id: 'FA-002', name: 'Elena Salazar Ruiz', document: '', deathDate: '2026-10-04', clientId: 'CL-002' }
  ],
  services: [
    { id: 'SV-001', name: 'Velación Serenidad', description: 'Sala privada, coordinación de ceremonia y acompañamiento familiar.', price: 2800, active: true },
    { id: 'SV-002', name: 'Cremación Integral', description: 'Cremación, urna conmemorativa y ceremonia de despedida.', price: 3600, active: true },
    { id: 'SV-003', name: 'Traslado Nacional', description: 'Coordinación y traslado terrestre dentro del país.', price: 1900, active: true }
  ],
  reservations: [
    { id: 'RS-2026-001', clientId: 'CL-001', deceasedId: 'FA-001', serviceId: 'SV-001', date: '2026-10-06', time: '10:00', status: 'En preparación', history: [{ status: 'Por confirmar', at: '2026-10-03 09:10' }, { status: 'En preparación', at: '2026-10-04 15:30' }] },
    { id: 'RS-2026-002', clientId: 'CL-002', deceasedId: 'FA-002', serviceId: 'SV-002', date: '2026-10-06', time: '16:00', status: 'Por confirmar', history: [{ status: 'Por confirmar', at: '2026-10-04 17:45' }] }
  ],
  pickups: [
    { id: 'RC-001', deceasedId: 'FA-001', clientId: 'CL-001', pickupAddress: 'Hospital Regional Docente de Trujillo', destinationAddress: 'Funeraria Descanso Eterno', date: '2026-10-06', time: '12:30', status: 'Programado', notes: 'Coordinar el recojo con el familiar responsable.' }
  ],
  payments: [
    { id: 'PG-001', reservationId: 'RS-2026-001', date: '2026-10-04', method: 'Transferencia', amount: 1400, status: 'Parcial' }
  ],
  users: [
    { id: 'US-001', name: 'Marielsys López', email: 'admin@descansoeterno.pe', role: 'Administrador', active: true },
    { id: 'US-002', name: 'Laura Méndez', email: 'atencion@descansoeterno.pe', role: 'Atención', active: true },
    { id: 'US-003', name: 'Miguel Castillo', email: 'operaciones@descansoeterno.pe', role: 'Operaciones', active: true }
  ]
};

let data = loadData();
let currentType = '';
let editingId = null;
const loginScreen = document.querySelector('#login-screen');
const appShell = document.querySelector('#app-shell');
const dialog = document.querySelector('#record-dialog');
const form = document.querySelector('#record-form');
const fields = document.querySelector('#form-fields');
const toast = document.querySelector('#system-toast');

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return structuredClone(seed);

    stored.clients = (stored.clients || []).map(client => ({
      funnelStage: 'Entrante',
      email: '',
      address: '',
      serviceId: '',
      source: '',
      contactMethod: '',
      photo: '',
      ...client
    }));

    stored.pickups = stored.pickups || [];

    return stored;
  } catch {
    return structuredClone(seed);
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    renderAll();
    return true;
  } catch (error) {
    console.error('No se pudieron guardar los datos:', error);
    showToast('No se pudo guardar. Si adjuntaste una foto, prueba con una imagen más pequeña.');
    return false;
  }
}

function byId(collection, id) { return data[collection].find(item => item.id === id); }
function today() { return new Date().toISOString().slice(0, 10); }
function money(value) { return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(value || 0); }
function displayDate(value) { if (!value) return '—'; return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`)); }
function slug(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'); }
function nextId(prefix, list) { return `${prefix}-${String(list.length + 1).padStart(3, '0')}`; }
function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]); }

document.querySelector('#login-form').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value;
  if (email === 'admin@descansoeterno.pe' && password === 'Demo2026!') {
    sessionStorage.setItem(SESSION_KEY, 'active');
    enterApp();
  } else {
    document.querySelector('#login-error').textContent = 'Las credenciales no son válidas. Usa el acceso de demostración.';
  }
});

function enterApp() {
  loginScreen.hidden = true;
  appShell.hidden = false;
  renderAll();
}

document.querySelector('#logout').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  appShell.hidden = true;
  loginScreen.hidden = false;
});

if (sessionStorage.getItem(SESSION_KEY) === 'active') enterApp();

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
document.querySelectorAll('[data-jump]').forEach(button => button.addEventListener('click', () => showView(button.dataset.jump)));

function showView(name) {
  document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
  document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === name));
  document.querySelector('#sidebar').classList.remove('open');
  document.querySelector('#mobile-menu').setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelector('#mobile-menu').addEventListener('click', event => {
  const open = document.querySelector('#sidebar').classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('[data-quick]').forEach(button => button.addEventListener('click', () => openForm(button.dataset.quick)));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('.close-action').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const formConfig = {
  client: { title: 'Registrar cliente responsable', eyebrow: 'HU01 · Registro de cliente', collection: 'clients', prefix: 'CL', fields: [
    ['funnelStage', 'Etapa del embudo', ['Entrante', 'Interesado', 'Ofertado', 'Ganado', 'Perdido'], true],
    ['name', 'Nombres y apellidos', 'text', true, 'full'],
    ['document', 'Documento de identidad (opcional)', 'text', false],
    ['phone', 'Teléfono internacional', 'tel', true],
    ['email', 'Correo electrónico', 'email', true],
    ['address', 'Dirección', 'text', true, 'full'],
    ['serviceId', 'Servicio a contratar', 'services', true, 'full'],
    ['source', '¿Cómo nos conoció?', ['Facebook', 'Instagram', 'TikTok', 'Google', 'Recomendación', 'Volante', 'Otro'], true],
    ['contactMethod', 'Forma de contacto', ['Llamada', 'WhatsApp', 'Correo', 'Presencial'], true],
    ['created', 'Fecha de registro', 'date', true],
    ['photo', 'Foto del cliente', 'file', false, 'full']
  ]},
  deceased: { title: 'Registrar persona fallecida', eyebrow: 'HU02 · Asociación familiar', collection: 'deceased', prefix: 'FA', fields: [
    ['name', 'Nombres y apellidos', 'text', true, 'full'], ['document', 'Documento (opcional)', 'text', false], ['deathDate', 'Fecha de fallecimiento', 'date', true], ['clientId', 'Cliente responsable', 'clients', true, 'full']
  ]},
  service: { title: 'Registrar servicio funerario', eyebrow: 'HU04 · Catálogo de servicios', collection: 'services', prefix: 'SV', fields: [
    ['name', 'Nombre del servicio', 'text', true, 'full'], ['description', 'Descripción', 'textarea', true, 'full'], ['price', 'Precio', 'number', true], ['active', 'Servicio disponible', 'checkbox', false]
  ]},
  reservation: { title: 'Registrar reserva', eyebrow: 'HU07 · Contratación', collection: 'reservations', prefix: 'RS', fields: [
    ['clientId', 'Cliente responsable', 'clients', true], ['deceasedId', 'Persona fallecida', 'deceased', true], ['serviceId', 'Servicio', 'services', true, 'full'], ['date', 'Fecha', 'date', true], ['time', 'Hora', 'time', true]
  ]},
  pickup: { title: 'Registrar solicitud de recojo', eyebrow: 'Recojo y traslado del fallecido', collection: 'pickups', prefix: 'RC', fields: [
    ['deceasedId', 'Persona fallecida', 'deceased', true, 'full'],
    ['clientId', 'Cliente responsable', 'clients', true, 'full'],
    ['pickupAddress', 'Dirección de recojo', 'text', true, 'full'],
    ['destinationAddress', 'Dirección de destino', 'text', true, 'full'],
    ['date', 'Fecha de recojo', 'date', true],
    ['time', 'Hora de recojo', 'time', true],
    ['status', 'Estado', ['Solicitado', 'Programado', 'En traslado', 'Completado', 'Cancelado'], true],
    ['notes', 'Observaciones', 'textarea', false, 'full']
  ]},
  payment: { title: 'Registrar pago', eyebrow: 'HU10 · Control económico', collection: 'payments', prefix: 'PG', fields: [
    ['reservationId', 'Reserva asociada', 'reservations', true, 'full'], ['amount', 'Monto', 'number', true], ['method', 'Método de pago', ['Efectivo', 'Transferencia', 'Tarjeta'], true], ['status', 'Estado del pago', ['Parcial', 'Pagado'], true]
  ]},
  user: { title: 'Registrar usuario', eyebrow: 'HU16 · Acceso autorizado', collection: 'users', prefix: 'US', fields: [
    ['name', 'Nombre completo', 'text', true, 'full'], ['email', 'Correo', 'email', true, 'full'], ['role', 'Rol', ['Administrador', 'Atención', 'Operaciones'], true], ['active', 'Usuario activo', 'checkbox', false]
  ]}
};

function openForm(type, id = null) {
  currentType = type;
  editingId = id;
  const config = formConfig[type];
  const current = id ? { ...byId(config.collection, id) } : {};

  if (type === 'client' && !id) {
    current.funnelStage = 'Entrante';
    current.created = today();
  }

  if (type === 'pickup' && !id) {
    current.status = 'Solicitado';
    current.date = today();
  }

  document.querySelector('#dialog-title').textContent = id ? `Actualizar ${config.title.replace('Registrar ', '').toLowerCase()}` : config.title;
  document.querySelector('#dialog-eyebrow').textContent = id ? 'Actualizar información registrada' : config.eyebrow;
  document.querySelector('#form-message').textContent = '';
  fields.innerHTML = config.fields.map(([name, label, typeDef, required, className = '']) => fieldHtml(name, label, typeDef, required, className, current[name])).join('');

  if (type === 'client') {
    const funnelInput = form.querySelector('[name="funnelStage"]');
    const createdInput = form.querySelector('[name="created"]');

    if (funnelInput && !id) {
      funnelInput.value = 'Entrante';
      funnelInput.disabled = true;
    }

    if (createdInput) {
      createdInput.value = current.created || today();
      createdInput.readOnly = true;
    }

    prepareClientForm(current.photo || '');
  }

  if (type === 'pickup') {
    const deceasedSelect = form.querySelector('[name="deceasedId"]');
    const clientSelect = form.querySelector('[name="clientId"]');

    if (deceasedSelect && clientSelect) {
      const syncResponsible = () => {
        const deceased = byId('deceased', deceasedSelect.value);
        if (deceased) clientSelect.value = deceased.clientId;
      };

      deceasedSelect.addEventListener('change', syncResponsible);
      if (!id && deceasedSelect.value) syncResponsible();
    }
  }

  dialog.showModal();
}

function fieldHtml(name, label, typeDef, required, className, value) {
  const req = required ? 'required' : '';

  if (typeDef === 'textarea') {
    return `<label class="${className}">${label}<textarea name="${name}" rows="3" ${req}>${escapeHtml(value || '')}</textarea></label>`;
  }

  if (typeDef === 'checkbox') {
    return `<label class="check ${className}"><input name="${name}" type="checkbox" ${value !== false ? 'checked' : ''}/> ${label}</label>`;
  }

  if (typeDef === 'file') {
    return `<label class="${className}">${label}<input name="${name}" type="file" accept="image/png,image/jpeg,image/webp" ${req}/><small class="field-help">JPG, PNG o WEBP. Máximo 1 MB.</small><div class="photo-preview" data-photo-preview>${value ? `<img src="${value}" alt="Foto registrada del cliente"/>` : '<span>Sin foto seleccionada</span>'}</div></label>`;
  }

  if (Array.isArray(typeDef)) {
    return `<label class="${className}">${label}<select name="${name}" ${req}><option value="">Selecciona</option>${typeDef.map(item => `<option value="${escapeHtml(item)}" ${item === value ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select></label>`;
  }

  if (data[typeDef]) {
    const options = data[typeDef]
      .filter(item => item.active !== false && item.status !== 'Cancelada')
      .map(item => `<option value="${item.id}" ${item.id === value ? 'selected' : ''}>${escapeHtml(item.name || item.id)}</option>`)
      .join('');
    return `<label class="${className}">${label}<select name="${name}" ${req}><option value="">Selecciona</option>${options}</select></label>`;
  }

  let extra = '';
  if (typeDef === 'number') extra = 'min="0.01" step="0.01"';
  if (typeDef === 'tel') extra = 'placeholder="+51987654321" pattern="^\\+[1-9][0-9]{7,14}$"';
  if (typeDef === 'email') extra = 'placeholder="cliente@correo.com"';

  return `<label class="${className}">${label}<input name="${name}" type="${typeDef}" value="${escapeHtml(value ?? '')}" ${req} ${extra}/></label>`;
}

function prepareClientForm(existingPhoto = '') {
  const addressInput = form.querySelector('[name="address"]');
  const photoInput = form.querySelector('[name="photo"]');
  const photoPreview = form.querySelector('[data-photo-preview]');

  if (addressInput) {
    const mapContainer = document.createElement('div');
    mapContainer.className = 'client-map full';
    addressInput.closest('label').insertAdjacentElement('afterend', mapContainer);

    let timeout;
    const refreshMap = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => updateClientMap(addressInput.value), 450);
    };

    addressInput.addEventListener('input', refreshMap);
    updateClientMap(addressInput.value);
  }

  if (photoInput && photoPreview) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files?.[0];
      if (!file) {
        photoPreview.innerHTML = existingPhoto ? `<img src="${existingPhoto}" alt="Foto registrada del cliente"/>` : '<span>Sin foto seleccionada</span>';
        return;
      }

      if (!file.type.startsWith('image/')) {
        photoPreview.innerHTML = '<span>El archivo seleccionado no es una imagen.</span>';
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      photoPreview.innerHTML = `<img src="${previewUrl}" alt="Vista previa de la foto del cliente"/>`;
      photoPreview.querySelector('img').addEventListener('load', () => URL.revokeObjectURL(previewUrl), { once: true });
    });
  }
}

function updateClientMap(address) {
  const container = form.querySelector('.client-map');
  if (!container) return;

  const cleanAddress = address.trim();
  if (!cleanAddress) {
    container.innerHTML = '<span class="map-placeholder">Ingresa una dirección para visualizarla automáticamente en el mapa.</span>';
    return;
  }

  const mapAddress = encodeURIComponent(cleanAddress);
  container.innerHTML = `<div class="map-label">Ubicación de la dirección</div><iframe title="Mapa de la dirección del cliente" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${mapAddress}&output=embed"></iframe>`;
}

function validateClient(formData) {
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const serviceId = String(formData.get('serviceId') || '').trim();
  const source = String(formData.get('source') || '').trim();
  const contactMethod = String(formData.get('contactMethod') || '').trim();

  if (name.split(/\s+/).filter(Boolean).length < 2) return 'Ingresa al menos un nombre y un apellido.';
  if (!/^\+[1-9][0-9]{7,14}$/.test(phone)) return 'El teléfono debe usar formato internacional, por ejemplo +51987654321.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un correo electrónico válido.';
  if (!address) return 'La dirección es obligatoria.';
  if (!serviceId) return 'Selecciona el servicio a contratar.';
  if (!source) return 'Indica cómo conoció la funeraria.';
  if (!contactMethod) return 'Selecciona la forma de contacto.';
  return null;
}

function validateService(formData) {
  const price = Number(formData.get('price'));
  if (!Number.isFinite(price) || price <= 0) return 'El precio debe ser mayor que S/ 0.00.';
  return null;
}

function validatePickup(formData) {
  const deceasedId = String(formData.get('deceasedId') || '').trim();
  const clientId = String(formData.get('clientId') || '').trim();
  const pickupAddress = String(formData.get('pickupAddress') || '').trim();
  const destinationAddress = String(formData.get('destinationAddress') || '').trim();
  const date = String(formData.get('date') || '').trim();
  const time = String(formData.get('time') || '').trim();

  if (!deceasedId) return 'Selecciona la persona fallecida.';
  if (!clientId) return 'Selecciona el cliente responsable.';
  const deceased = byId('deceased', deceasedId);
  if (deceased && deceased.clientId !== clientId) return 'El cliente responsable no corresponde a la persona fallecida seleccionada.';
  if (!pickupAddress) return 'Ingresa la dirección de recojo.';
  if (!destinationAddress) return 'Ingresa la dirección de destino.';
  if (!date || !time) return 'Indica la fecha y hora del recojo.';
  return null;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.readAsDataURL(file);
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const config = formConfig[currentType];
  const formData = new FormData(form);

  if (currentType === 'client' && !editingId) {
    formData.set('funnelStage', 'Entrante');
    formData.set('created', today());
  }

  const validationError = currentType === 'client'
    ? validateClient(formData)
    : currentType === 'service'
      ? validateService(formData)
      : currentType === 'pickup'
        ? validatePickup(formData)
        : null;

  if (validationError) {
    document.querySelector('#form-message').textContent = validationError;
    return;
  }

  const record = editingId
    ? { ...byId(config.collection, editingId) }
    : { id: createId(currentType, config), created: today() };

  for (const [name, , typeDef] of config.fields) {
    if (typeDef === 'checkbox') {
      record[name] = form.querySelector(`[name="${name}"]`).checked;
      continue;
    }
    if (typeDef === 'file') continue;

    let value = formData.get(name);
    if (typeDef === 'number') value = Number(value);
    if (typeof value === 'string') value = value.trim();
    record[name] = value;
  }

  if (currentType === 'client') {
    if (!editingId) {
      record.funnelStage = 'Entrante';
      record.created = today();
    }

    const photoInput = form.querySelector('[name="photo"]');
    const file = photoInput?.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        document.querySelector('#form-message').textContent = 'La foto seleccionada no es una imagen válida.';
        return;
      }
      if (file.size > 1024 * 1024) {
        document.querySelector('#form-message').textContent = 'La fotografía no debe superar 1 MB.';
        return;
      }

      try {
        record.photo = await fileToBase64(file);
      } catch {
        document.querySelector('#form-message').textContent = 'No se pudo procesar la fotografía.';
        return;
      }
    }
  }

  if (currentType === 'reservation' && !editingId) {
    record.status = 'Por confirmar';
    record.history = [{ status: record.status, at: new Date().toLocaleString('es-PE') }];
  }
  if (currentType === 'payment' && !editingId) record.date = today();
  if (currentType === 'user' && !editingId) record.active = true;

  if (editingId) data[config.collection] = data[config.collection].map(item => item.id === editingId ? record : item);
  else data[config.collection].push(record);

  if (!saveData()) return;

  document.querySelector('#form-message').textContent = editingId ? 'Información actualizada correctamente.' : 'Registro guardado correctamente.';
  showToast(editingId ? 'Cambios guardados.' : 'Registro creado con éxito.');
  setTimeout(() => dialog.close(), 650);
});

function createId(type, config) {
  if (type === 'reservation') {
    const year = new Date().getFullYear();
    const numbers = data.reservations
      .map(item => Number(String(item.id).match(/^RS-\d{4}-(\d+)$/)?.[1] || 0));
    return `RS-${year}-${String(Math.max(0, ...numbers) + 1).padStart(3, '0')}`;
  }

  const numbers = data[config.collection]
    .map(item => Number(String(item.id).match(/-(\d+)$/)?.[1] || 0));
  return `${config.prefix}-${String(Math.max(0, ...numbers) + 1).padStart(3, '0')}`;
}

function renderAll() {
  renderMetrics(); renderClients(); renderDeceased(); renderServices(); renderReservations(); renderPickups(); renderTracking(); renderPayments(); renderUsers();
}

function renderMetrics() {
  const activeReservations = data.reservations.filter(item => !['Finalizado', 'Cancelada'].includes(item.status));
  const pendingTotal = data.reservations.reduce((sum, reservation) => {
    const price = byId('services', reservation.serviceId)?.price || 0;
    const paid = data.payments.filter(payment => payment.reservationId === reservation.id).reduce((value, payment) => value + Number(payment.amount), 0);
    return sum + Math.max(0, price - paid);
  }, 0);
  document.querySelector('#metrics').innerHTML = [
    ['Servicios activos', activeReservations.length, 'reservas en proceso'], ['Clientes', data.clients.length, 'responsables registrados'], ['Catálogo disponible', data.services.filter(item => item.active).length, 'servicios activos'], ['Saldo pendiente', money(pendingTotal), 'por recaudar']
  ].map(([label, value, detail]) => `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`).join('');
  document.querySelector('#upcoming-list').innerHTML = data.reservations.filter(item => item.status !== 'Cancelada').sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).slice(0, 5).map(reservation => {
    const client = byId('clients', reservation.clientId); const service = byId('services', reservation.serviceId); const date = new Date(`${reservation.date}T12:00:00`);
    return `<div class="upcoming-item"><div class="date-box"><strong>${String(date.getDate()).padStart(2, '0')}</strong>${date.toLocaleDateString('es-PE', { month: 'short' })}</div><div><h3>${escapeHtml(client?.name || 'Sin cliente')}</h3><p>${escapeHtml(service?.name || 'Sin servicio')} · ${reservation.time}</p></div><span class="status-pill ${slug(reservation.status)}">${reservation.status}</span></div>`;
  }).join('') || '<p class="empty-row">No hay servicios programados.</p>';
  const statuses = ['Por confirmar', 'En preparación', 'En ceremonia', 'Finalizado'];
  document.querySelector('#status-summary').innerHTML = statuses.map(status => {
    const count = data.reservations.filter(item => item.status === status).length; const percent = data.reservations.length ? Math.round(count / data.reservations.length * 100) : 0;
    return `<div class="status-row"><div><span>${status}</span><strong>${count}</strong></div><div class="bar"><span style="width:${percent}%"></span></div></div>`;
  }).join('');
}

function renderClients() {
  const tbody = document.querySelector('#clients-table tbody');
  tbody.innerHTML = data.clients.map(item => {
    const service = byId('services', item.serviceId);
    return `<tr><td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.email || item.document || item.id)}</small></td><td><span class="status-pill">${escapeHtml(item.funnelStage || 'Entrante')}</span></td><td><strong>${escapeHtml(item.phone || '—')}</strong><small>${escapeHtml(item.contactMethod || 'Sin medio')}</small></td><td>${escapeHtml(service?.name || 'Sin servicio')}</td><td>${displayDate(item.created)}</td><td><button class="action-button" data-edit="client" data-id="${item.id}">Editar</button></td></tr>`;
  }).join('') || emptyRow(6, 'No hay clientes registrados.');
  document.querySelector('#clients-count').textContent = `${data.clients.length} registros`;
}

function renderDeceased() {
  document.querySelector('#deceased-table tbody').innerHTML = data.deceased.map(item => `<tr><td><strong>${escapeHtml(item.name)}</strong><small>${item.id}</small></td><td>${escapeHtml(item.document || 'No registrado')}</td><td>${displayDate(item.deathDate)}</td><td>${escapeHtml(byId('clients', item.clientId)?.name || 'Sin asociación')}</td><td><button class="action-button" data-edit="deceased" data-id="${item.id}">Editar</button></td></tr>`).join('') || emptyRow(5, 'No hay personas registradas.');
  document.querySelector('#deceased-count').textContent = `${data.deceased.length} registros`;
}

function renderServices() {
  document.querySelector('#services-grid').innerHTML = data.services.map(item => `<article class="service-admin-card"><header><div><p class="eyebrow">${item.id}</p><h2>${escapeHtml(item.name)}</h2></div><span class="availability ${item.active ? 'active' : 'inactive'}">${item.active ? 'Disponible' : 'Inactivo'}</span></header><p>${escapeHtml(item.description)}</p><footer><strong>${money(item.price)}</strong><button class="action-button" data-edit="service" data-id="${item.id}">Editar</button></footer></article>`).join('');
}

function renderReservations() {
  document.querySelector('#reservations-table tbody').innerHTML = data.reservations.map(item => `<tr><td><strong>${item.id}</strong><small>${escapeHtml(byId('deceased', item.deceasedId)?.name || '')}</small></td><td>${escapeHtml(byId('clients', item.clientId)?.name || '—')}</td><td>${escapeHtml(byId('services', item.serviceId)?.name || '—')}</td><td>${displayDate(item.date)} · ${item.time}</td><td><span class="status-pill ${slug(item.status)}">${item.status}</span></td><td><button class="action-button" data-edit="reservation" data-id="${item.id}">Editar</button> ${item.status !== 'Cancelada' ? `<button class="action-button" data-cancel="${item.id}">Cancelar</button>` : ''}</td></tr>`).join('') || emptyRow(6, 'No hay reservas registradas.');
  document.querySelector('#reservations-count').textContent = `${data.reservations.length} reservas`;
}

function renderPickups() {
  const tbody = document.querySelector('#pickups-table tbody');
  if (!tbody) return;

  tbody.innerHTML = data.pickups.map(item => {
    const deceased = byId('deceased', item.deceasedId);
    const client = byId('clients', item.clientId);

    return `<tr><td><strong>${escapeHtml(item.id)}</strong></td><td><strong>${escapeHtml(deceased?.name || 'Sin fallecido')}</strong></td><td>${escapeHtml(client?.name || 'Sin responsable')}</td><td>${escapeHtml(item.pickupAddress || '—')}</td><td>${escapeHtml(item.destinationAddress || '—')}</td><td>${displayDate(item.date)} · ${escapeHtml(item.time || '—')}</td><td><span class="status-pill ${slug(item.status || 'Solicitado')}">${escapeHtml(item.status || 'Solicitado')}</span></td><td><button class="action-button" data-edit="pickup" data-id="${item.id}">Editar</button></td></tr>`;
  }).join('') || emptyRow(8, 'No hay solicitudes de recojo registradas.');

  document.querySelector('#pickups-count').textContent = `${data.pickups.length} solicitudes`;
}

function renderTracking() {
  document.querySelector('#tracking-grid').innerHTML = data.reservations.filter(item => item.status !== 'Cancelada').map(item => `<article class="tracking-card"><header><div><p class="eyebrow">${item.id}</p><h2>${escapeHtml(byId('clients', item.clientId)?.name || '')}</h2><p>${escapeHtml(byId('services', item.serviceId)?.name || '')} · ${displayDate(item.date)}</p></div><span class="status-pill ${slug(item.status)}">${item.status}</span></header><select data-status-for="${item.id}" aria-label="Actualizar estado de ${item.id}">${['Por confirmar','En preparación','En ceremonia','Finalizado'].map(status => `<option ${status === item.status ? 'selected' : ''}>${status}</option>`).join('')}</select><ul class="history">${[...(item.history || [])].reverse().slice(0, 4).map(entry => `<li><strong>${entry.status}</strong><br>${escapeHtml(entry.at)}</li>`).join('')}</ul></article>`).join('') || '<div class="panel empty-row">No hay servicios para seguimiento.</div>';
}

function renderPayments() {
  document.querySelector('#payments-table tbody').innerHTML = data.payments.map(item => `<tr><td><strong>${item.id}</strong></td><td>${item.reservationId}</td><td>${displayDate(item.date)}</td><td>${escapeHtml(item.method)}</td><td><strong>${money(item.amount)}</strong></td><td><span class="status-pill">${item.status}</span></td></tr>`).join('') || emptyRow(6, 'No hay pagos registrados.');
  document.querySelector('#payments-count').textContent = `${data.payments.length} pagos`;
}

function renderUsers() {
  document.querySelector('#users-table tbody').innerHTML = data.users.map(item => `<tr><td><strong>${escapeHtml(item.name)}</strong><small>${item.id}</small></td><td>${escapeHtml(item.email)}</td><td>${item.role}</td><td><span class="status-pill">${item.active ? 'Activo' : 'Inactivo'}</span></td></tr>`).join('');
}

function emptyRow(cols, message) { return `<tr class="empty-row"><td colspan="${cols}">${message}</td></tr>`; }

document.addEventListener('click', event => {
  const edit = event.target.closest('[data-edit]');
  if (edit) openForm(edit.dataset.edit, edit.dataset.id);
  const cancel = event.target.closest('[data-cancel]');
  if (cancel && confirm('¿Deseas cancelar esta reserva?')) {
    const reservation = byId('reservations', cancel.dataset.cancel); reservation.status = 'Cancelada'; reservation.history.push({ status: 'Cancelada', at: new Date().toLocaleString('es-PE') }); saveData(); showToast('Reserva cancelada y disponibilidad actualizada.');
  }
});

document.addEventListener('change', event => {
  if (!event.target.matches('[data-status-for]')) return;
  const reservation = byId('reservations', event.target.dataset.statusFor);
  reservation.status = event.target.value;
  reservation.history = reservation.history || [];
  reservation.history.push({ status: reservation.status, at: new Date().toLocaleString('es-PE') });
  saveData(); showToast('Estado del servicio actualizado.');
});

document.querySelectorAll('[data-table-filter]').forEach(input => input.addEventListener('input', () => {
  const value = input.value.toLowerCase();
  document.querySelectorAll(`#${input.dataset.tableFilter} tbody tr`).forEach(row => row.hidden = !row.textContent.toLowerCase().includes(value));
}));

document.querySelector('#global-search').addEventListener('input', event => {
  const query = event.target.value.trim().toLowerCase();
  if (query.length < 2) return;
  const match = [
    ...data.clients.map(item => ({ view: 'clients', text: `${item.name} ${item.document || ''} ${item.email || ''} ${item.phone || ''} ${item.funnelStage || ''}` })),
    ...data.reservations.map(item => ({ view: 'reservations', text: `${item.id} ${byId('clients', item.clientId)?.name}` })),
    ...data.pickups.map(item => ({ view: 'pickups', text: `${item.id} ${byId('deceased', item.deceasedId)?.name || ''} ${byId('clients', item.clientId)?.name || ''} ${item.pickupAddress || ''} ${item.destinationAddress || ''} ${item.status || ''}` })),
    ...data.services.map(item => ({ view: 'services', text: item.name }))
  ].find(item => item.text.toLowerCase().includes(query));
  if (match) showView(match.view);
});

let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000); }

renderAll();
