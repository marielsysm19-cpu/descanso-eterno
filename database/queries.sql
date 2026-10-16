USE descanso_eterno;


-- Ver servicios
SELECT * FROM services;


-- Ver clientes
SELECT * FROM clients;


-- Ver fallecidos
SELECT * FROM deceased;


-- Ver reservas
SELECT * FROM reservations;


-- Ver historial
SELECT * FROM reservation_history;


-- Ver pagos
SELECT * FROM payments;


-- Ver usuarios
SELECT * FROM users;


-- Ver traslados
SELECT * FROM transfers;


-- Ver saldo económico
SELECT * FROM vw_reservation_financial_status;


-- Ver clientes con su servicio de interés
SELECT
    c.id,
    c.name AS client_name,
    c.phone,
    c.email,
    s.name AS service_name
FROM clients c
INNER JOIN services s
    ON c.service_id = s.id;


-- Ver fallecido y responsable
SELECT
    d.id,
    d.name AS deceased_name,
    d.death_date,
    c.name AS responsible_client
FROM deceased d
INNER JOIN clients c
    ON d.client_id = c.id;


-- Ver detalle completo de reservas
SELECT
    r.id,
    c.name AS client,
    d.name AS deceased,
    s.name AS service,
    r.reservation_date,
    r.reservation_time,
    r.agreed_price,
    r.status
FROM reservations r
INNER JOIN clients c
    ON r.client_id = c.id
INNER JOIN deceased d
    ON r.deceased_id = d.id
INNER JOIN services s
    ON r.service_id = s.id;