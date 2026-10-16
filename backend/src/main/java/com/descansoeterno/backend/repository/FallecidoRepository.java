package com.descansoeterno.backend.repository;

import com.descansoeterno.backend.dto.FallecidoRequest;
import org.springframework.stereotype.Repository;

@Repository
public class FallecidoRepository {

    public void guardar(FallecidoRequest fallecido) {
        // La persistencia en SQL se implementará cuando
        // se integre la base de datos del proyecto.
    }

    public boolean existeCliente(Long clienteId) {
        // Temporalmente se valida que exista un identificador.
        // Luego esta comprobación se realizará mediante la BD/API.
        return clienteId != null && clienteId > 0;
    }
}