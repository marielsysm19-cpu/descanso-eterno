package com.descansoeterno.backend.controller;

import com.descansoeterno.backend.dto.SolicitudRecojoRequest;
import com.descansoeterno.backend.service.SolicitudRecojoService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/solicitudes-recojo")
public class SolicitudRecojoController {

    private final SolicitudRecojoService solicitudRecojoService;

    public SolicitudRecojoController(
            SolicitudRecojoService solicitudRecojoService) {
        this.solicitudRecojoService = solicitudRecojoService;
    }

    @PostMapping
    public ResponseEntity<String> registrarSolicitud(
            @Valid @RequestBody SolicitudRecojoRequest solicitud) {

        boolean registrado =
                solicitudRecojoService.registrarSolicitud(solicitud);

        if (!registrado) {
            return ResponseEntity.badRequest()
                    .body("La persona fallecida seleccionada no es válida");
        }

        return ResponseEntity.ok(
                "Solicitud de recojo registrada correctamente");
    }
}