package com.descansoeterno.backend.service;

import com.descansoeterno.backend.dto.SolicitudRecojoRequest;
import com.descansoeterno.backend.repository.SolicitudRecojoRepository;
import org.springframework.stereotype.Service;

@Service
public class SolicitudRecojoService {

    private final SolicitudRecojoRepository solicitudRecojoRepository;

    public SolicitudRecojoService(
            SolicitudRecojoRepository solicitudRecojoRepository) {
        this.solicitudRecojoRepository = solicitudRecojoRepository;
    }

    public boolean registrarSolicitud(SolicitudRecojoRequest solicitud) {

        if (!solicitudRecojoRepository.existeFallecido(
                solicitud.getFallecidoId())) {
            return false;
        }

        solicitudRecojoRepository.guardar(solicitud);

        return true;
    }
}