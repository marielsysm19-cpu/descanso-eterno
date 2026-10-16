USE descanso_eterno;


-- =========================================================
-- SERVICIOS
-- =========================================================

INSERT IGNORE INTO services
(
    id,
    name,
    description,
    price,
    active
)
VALUES
(
    'SV-001',
    'Velación Serenidad',
    'Sala privada, coordinación de ceremonia y acompañamiento familiar.',
    2800.00,
    TRUE
),
(
    'SV-002',
    'Cremación Integral',
    'Cremación, urna conmemorativa y ceremonia de despedida.',
    3600.00,
    TRUE
),
(
    'SV-003',
    'Traslado Nacional',
    'Coordinación y traslado terrestre dentro del país.',
    1900.00,
    TRUE
);


-- =========================================================
-- CLIENTES
-- =========================================================

INSERT IGNORE INTO clients
(
    id,
    funnel_stage,
    name,
    document,
    phone,
    email,
    address,
    service_id,
    source,
    contact_method,
    created,
    photo
)
VALUES
(
    'CL-001',
    'Entrante',
    'María Fernanda Rojas',
    '45781236',
    '+51987654210',
    'maria.rojas@example.com',
    'Av. España 1234, Trujillo, Perú',
    'SV-001',
    'Recomendación',
    'WhatsApp',
    '2026-10-03',
    NULL
),
(
    'CL-002',
    'Interesado',
    'Antonio Salazar',
    '42156987',
    '+51965114820',
    'antonio.salazar@example.com',
    'Av. América Sur 2450, Trujillo, Perú',
    'SV-002',
    'Google',
    'Llamada',
    '2026-10-04',
    NULL
);


-- =========================================================
-- PERSONAS FALLECIDAS
-- =========================================================

INSERT IGNORE INTO deceased
(
    id,
    name,
    document,
    death_date,
    client_id
)
VALUES
(
    'FA-001',
    'Carlos Alberto Rojas',
    '18112456',
    '2026-10-03',
    'CL-001'
),
(
    'FA-002',
    'Elena Salazar Ruiz',
    NULL,
    '2026-10-04',
    'CL-002'
);


-- =========================================================
-- RESERVAS
-- =========================================================

INSERT IGNORE INTO reservations
(
    id,
    client_id,
    deceased_id,
    service_id,
    reservation_date,
    reservation_time,
    agreed_price,
    status
)
VALUES
(
    'RS-2026-001',
    'CL-001',
    'FA-001',
    'SV-001',
    '2026-10-06',
    '10:00:00',
    2800.00,
    'En preparación'
),
(
    'RS-2026-002',
    'CL-002',
    'FA-002',
    'SV-002',
    '2026-10-06',
    '16:00:00',
    3600.00,
    'Por confirmar'
);


-- =========================================================
-- HISTORIAL
-- =========================================================

INSERT INTO reservation_history
(
    reservation_id,
    status,
    changed_at
)
SELECT
    'RS-2026-001',
    'Por confirmar',
    '2026-10-03 09:10:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM reservation_history
    WHERE reservation_id = 'RS-2026-001'
      AND status = 'Por confirmar'
      AND changed_at = '2026-10-03 09:10:00'
);


INSERT INTO reservation_history
(
    reservation_id,
    status,
    changed_at
)
SELECT
    'RS-2026-001',
    'En preparación',
    '2026-10-04 15:30:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM reservation_history
    WHERE reservation_id = 'RS-2026-001'
      AND status = 'En preparación'
      AND changed_at = '2026-10-04 15:30:00'
);


INSERT INTO reservation_history
(
    reservation_id,
    status,
    changed_at
)
SELECT
    'RS-2026-002',
    'Por confirmar',
    '2026-10-04 17:45:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM reservation_history
    WHERE reservation_id = 'RS-2026-002'
      AND status = 'Por confirmar'
      AND changed_at = '2026-10-04 17:45:00'
);


-- =========================================================
-- PAGOS
-- =========================================================

INSERT IGNORE INTO payments
(
    id,
    reservation_id,
    payment_date,
    method,
    amount,
    status
)
VALUES
(
    'PG-001',
    'RS-2026-001',
    '2026-10-04',
    'Transferencia',
    1400.00,
    'Parcial'
);


-- =========================================================
-- USUARIOS
-- =========================================================

INSERT IGNORE INTO users
(
    id,
    name,
    email,
    password_hash,
    role,
    active
)
VALUES
(
    'US-001',
    'Marielsys López',
    'admin@descansoeterno.pe',
    NULL,
    'Administrador',
    TRUE
),
(
    'US-002',
    'Laura Méndez',
    'atencion@descansoeterno.pe',
    NULL,
    'Atención',
    TRUE
),
(
    'US-003',
    'Miguel Castillo',
    'operaciones@descansoeterno.pe',
    NULL,
    'Operaciones',
    TRUE
);