package com.descansoeterno.backend.controller;

import com.descansoeterno.backend.dto.FallecidoRequest;
import com.descansoeterno.backend.service.FallecidoService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fallecidos")
public class FallecidoController {

    private final FallecidoService fallecidoService;

    public FallecidoController(FallecidoService fallecidoService) {
        this.fallecidoService = fallecidoService;
    }

    @PostMapping
    public ResponseEntity<String> registrarFallecido(
            @Valid @RequestBody FallecidoRequest fallecido) {

        boolean registrado = fallecidoService.registrarFallecido(fallecido);

        if (!registrado) {
            return ResponseEntity.badRequest()
                    .body("El cliente responsable no es válido");
        }

        return ResponseEntity.ok(
                "Persona fallecida registrada correctamente");
    }
}