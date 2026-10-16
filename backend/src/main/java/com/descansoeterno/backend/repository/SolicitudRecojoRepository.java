package com.descansoeterno.backend.repository;

import com.descansoeterno.backend.dto.SolicitudRecojoRequest;
import org.springframework.stereotype.Repository;

@Repository
public class SolicitudRecojoRepository {

    public void guardar(SolicitudRecojoRequest solicitud) {
        // La persistencia definitiva se realizará cuando
        // se integre la base de datos del proyecto.
    }

    public boolean existeFallecido(Long fallecidoId) {
        // Temporalmente se valida que exista un identificador.
        // Luego esta comprobación se realizará mediante la BD/API.
        return fallecidoId != null && fallecidoId > 0;
    }
}