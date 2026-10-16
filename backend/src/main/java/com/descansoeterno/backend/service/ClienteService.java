package com.descansoeterno.backend.service;

import com.descansoeterno.backend.dto.ClienteRequest;
import com.descansoeterno.backend.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public boolean registrarCliente(ClienteRequest cliente) {

        int filasAfectadas = clienteRepository.registrar(cliente);

        return filasAfectadas > 0;
    }
}