package com.descansoeterno.backend.controller;

import com.descansoeterno.backend.dto.ClienteRequest;
import com.descansoeterno.backend.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> registrarCliente(
            @Valid @RequestBody ClienteRequest cliente) {

        boolean registrado = clienteService.registrarCliente(cliente);

        if (registrado) {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "mensaje",
                            "Cliente registrado correctamente"
                    ));
        }

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "mensaje",
                        "No se pudo registrar el cliente"
                ));
    }
}