package com.descansoeterno.backend.service;

import com.descansoeterno.backend.dto.ReservaRequest;
import com.descansoeterno.backend.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    public String registrarReserva(ReservaRequest reserva) {

        if (!reservaRepository.existeCliente(reserva.getClienteId())) {
            return null;
        }

        if (!reservaRepository.existeFallecido(reserva.getFallecidoId())) {
            return null;
        }

        if (!reservaRepository.existeServicioDisponible(
                reserva.getServicioId())) {
            return null;
        }

        String identificador = generarIdentificador();

        reservaRepository.guardar(reserva, identificador);

        return identificador;
    }

    private String generarIdentificador() {
        return "RES-" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }
}