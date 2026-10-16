CREATE DATABASE IF NOT EXISTS descanso_eterno
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE descanso_eterno;


-- =========================================================
-- PROYECTO: DESCANSO ETERNO
-- RESPONSABLE BD: RODRIGO JARA
-- MODELO DE DATOS DEL MVP
-- =========================================================


-- =========================================================
-- 1. SERVICIOS FUNERARIOS
-- =========================================================

CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(20) PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    description VARCHAR(500) NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_service_price
        CHECK (price > 0)
);


-- =========================================================
-- 2. CLIENTES RESPONSABLES
-- =========================================================

CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(20) PRIMARY KEY,

    funnel_stage VARCHAR(20) NOT NULL DEFAULT 'Entrante',

    name VARCHAR(150) NOT NULL,

    document VARCHAR(20) NULL UNIQUE,

    phone VARCHAR(20) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    address VARCHAR(250) NOT NULL,

    service_id VARCHAR(20) NOT NULL,

    source VARCHAR(30) NOT NULL,

    contact_method VARCHAR(20) NOT NULL,

    created DATE NOT NULL,

    photo MEDIUMTEXT NULL,

    CONSTRAINT fk_client_service
        FOREIGN KEY (service_id)
        REFERENCES services(id),

    CONSTRAINT chk_client_funnel
        CHECK (
            funnel_stage IN (
                'Entrante',
                'Interesado',
                'Ofertado',
                'Ganado',
                'Perdido'
            )
        ),

    CONSTRAINT chk_client_source
        CHECK (
            source IN (
                'Facebook',
                'Instagram',
                'TikTok',
                'Google',
                'Recomendación',
                'Volante',
                'Otro'
            )
        ),

    CONSTRAINT chk_client_contact_method
        CHECK (
            contact_method IN (
                'Llamada',
                'WhatsApp',
                'Correo',
                'Presencial'
            )
        )
);


-- =========================================================
-- 3. PERSONAS FALLECIDAS
-- =========================================================

CREATE TABLE IF NOT EXISTS deceased (
    id VARCHAR(20) PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    document VARCHAR(20) NULL,

    death_date DATE NOT NULL,

    client_id VARCHAR(20) NOT NULL,

    CONSTRAINT fk_deceased_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
);


-- =========================================================
-- 4. RESERVAS
-- =========================================================

CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(30) PRIMARY KEY,

    client_id VARCHAR(20) NOT NULL,

    deceased_id VARCHAR(20) NOT NULL,

    service_id VARCHAR(20) NOT NULL,

    reservation_date DATE NOT NULL,

    reservation_time TIME NOT NULL,

    agreed_price DECIMAL(10,2) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'Por confirmar',

    CONSTRAINT fk_reservation_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id),

    CONSTRAINT fk_reservation_deceased
        FOREIGN KEY (deceased_id)
        REFERENCES deceased(id),

    CONSTRAINT fk_reservation_service
        FOREIGN KEY (service_id)
        REFERENCES services(id),

    CONSTRAINT chk_reservation_price
        CHECK (agreed_price > 0),

    CONSTRAINT chk_reservation_status
        CHECK (
            status IN (
                'Por confirmar',
                'En preparación',
                'En ceremonia',
                'Finalizado',
                'Cancelada'
            )
        )
);


-- =========================================================
-- 5. HISTORIAL DE ESTADOS DE RESERVA
-- =========================================================

CREATE TABLE IF NOT EXISTS reservation_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    reservation_id VARCHAR(30) NOT NULL,

    status VARCHAR(30) NOT NULL,

    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservations(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_history_status
        CHECK (
            status IN (
                'Por confirmar',
                'En preparación',
                'En ceremonia',
                'Finalizado',
                'Cancelada'
            )
        )
);


-- =========================================================
-- 6. PAGOS
-- =========================================================

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(20) PRIMARY KEY,

    reservation_id VARCHAR(30) NOT NULL,

    payment_date DATE NOT NULL,

    method VARCHAR(30) NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_payment_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservations(id),

    CONSTRAINT chk_payment_amount
        CHECK (amount > 0),

    CONSTRAINT chk_payment_method
        CHECK (
            method IN (
                'Efectivo',
                'Transferencia',
                'Tarjeta'
            )
        ),

    CONSTRAINT chk_payment_status
        CHECK (
            status IN (
                'Parcial',
                'Pagado'
            )
        )
);


-- =========================================================
-- 7. USUARIOS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(20) PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NULL,

    role VARCHAR(30) NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_user_role
        CHECK (
            role IN (
                'Administrador',
                'Atención',
                'Operaciones'
            )
        )
);


-- =========================================================
-- 8. RECOJO Y TRASLADO
-- =========================================================

CREATE TABLE IF NOT EXISTS transfers (
    id VARCHAR(20) PRIMARY KEY,

    reservation_id VARCHAR(30) NOT NULL,

    pickup_address VARCHAR(250) NOT NULL,

    destination_address VARCHAR(250) NOT NULL,

    scheduled_at DATETIME NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'Solicitado',

    notes VARCHAR(500) NULL,

    CONSTRAINT fk_transfer_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservations(id),

    CONSTRAINT chk_transfer_status
        CHECK (
            status IN (
                'Solicitado',
                'Programado',
                'En traslado',
                'Completado',
                'Cancelado'
            )
        )
);


-- =========================================================
-- 9. VISTA PARA ESTADO ECONÓMICO
-- =========================================================

CREATE OR REPLACE VIEW vw_reservation_financial_status AS

SELECT
    r.id AS reservation_id,

    r.agreed_price,

    COALESCE(
        SUM(p.amount),
        0
    ) AS total_paid,

    GREATEST(
        r.agreed_price - COALESCE(SUM(p.amount), 0),
        0
    ) AS pending_balance

FROM reservations r

LEFT JOIN payments p
    ON p.reservation_id = r.id

GROUP BY
    r.id,
    r.agreed_price;