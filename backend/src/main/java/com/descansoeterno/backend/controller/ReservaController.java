package com.descansoeterno.backend.controller;

import com.descansoeterno.backend.dto.ReservaRequest;
import com.descansoeterno.backend.service.ReservaService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<String> registrarReserva(
            @Valid @RequestBody ReservaRequest reserva) {

        String identificador =
                reservaService.registrarReserva(reserva);

        if (identificador == null) {
            return ResponseEntity.badRequest()
                    .body("No se pudo registrar la reserva. Verifique el cliente, fallecido y servicio seleccionado.");
        }

        return ResponseEntity.ok(
                "Reserva registrada correctamente. Identificador: "
                        + identificador);
    }
}