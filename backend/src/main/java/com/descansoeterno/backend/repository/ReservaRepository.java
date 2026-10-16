package com.descansoeterno.backend.repository;

import com.descansoeterno.backend.dto.ReservaRequest;
import org.springframework.stereotype.Repository;

@Repository
public class ReservaRepository {

    public void guardar(ReservaRequest reserva, String identificador) {
        // La persistencia definitiva se realizará cuando
        // se integre completamente la base de datos del proyecto.
    }

    public boolean existeCliente(Long clienteId) {
        return clienteId != null && clienteId > 0;
    }

    public boolean existeFallecido(Long fallecidoId) {
        return fallecidoId != null && fallecidoId > 0;
    }

    public boolean existeServicioDisponible(Long servicioId) {
        return servicioId != null && servicioId > 0;
    }
}