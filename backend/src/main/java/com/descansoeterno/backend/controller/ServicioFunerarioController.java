package com.descansoeterno.backend.controller;

import com.descansoeterno.backend.dto.ServicioFunerarioRequest;
import com.descansoeterno.backend.service.ServicioFunerarioService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/servicios-funerarios")
public class ServicioFunerarioController {

    private final ServicioFunerarioService servicioFunerarioService;

    public ServicioFunerarioController(
            ServicioFunerarioService servicioFunerarioService) {
        this.servicioFunerarioService = servicioFunerarioService;
    }

    @PostMapping
    public ResponseEntity<String> registrarServicio(
            @Valid @RequestBody ServicioFunerarioRequest servicio) {

        servicioFunerarioService.registrarServicio(servicio);

        return ResponseEntity.ok(
                "Servicio funerario registrado correctamente");
    }
}