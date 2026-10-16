package com.descansoeterno.backend.service;

import com.descansoeterno.backend.dto.FallecidoRequest;
import com.descansoeterno.backend.repository.FallecidoRepository;
import org.springframework.stereotype.Service;

@Service
public class FallecidoService {

    private final FallecidoRepository fallecidoRepository;

    public FallecidoService(FallecidoRepository fallecidoRepository) {
        this.fallecidoRepository = fallecidoRepository;
    }

    public boolean registrarFallecido(FallecidoRequest fallecido) {

        if (!fallecidoRepository.existeCliente(fallecido.getClienteId())) {
            return false;
        }

        fallecidoRepository.guardar(fallecido);

        return true;
    }
}