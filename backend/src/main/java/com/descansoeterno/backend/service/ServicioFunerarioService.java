package com.descansoeterno.backend.service;

import com.descansoeterno.backend.dto.ServicioFunerarioRequest;
import com.descansoeterno.backend.repository.ServicioFunerarioRepository;
import org.springframework.stereotype.Service;

@Service
public class ServicioFunerarioService {

    private final ServicioFunerarioRepository servicioFunerarioRepository;

    public ServicioFunerarioService(
            ServicioFunerarioRepository servicioFunerarioRepository) {
        this.servicioFunerarioRepository = servicioFunerarioRepository;
    }

    public void registrarServicio(ServicioFunerarioRequest servicio) {
        servicioFunerarioRepository.guardar(servicio);
    }
}