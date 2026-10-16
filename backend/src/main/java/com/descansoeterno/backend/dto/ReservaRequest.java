package com.descansoeterno.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ReservaRequest {

    @NotNull(message = "Debe seleccionar un cliente responsable")
    @Positive(message = "El cliente seleccionado no es válido")
    private Long clienteId;

    @NotNull(message = "Debe seleccionar una persona fallecida")
    @Positive(message = "La persona fallecida seleccionada no es válida")
    private Long fallecidoId;

    @NotNull(message = "Debe seleccionar un servicio funerario")
    @Positive(message = "El servicio seleccionado no es válido")
    private Long servicioId;

    @NotNull(message = "La fecha de la reserva es obligatoria")
    private LocalDate fecha;

    @NotNull(message = "La hora de la reserva es obligatoria")
    private LocalTime hora;

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getFallecidoId() {
        return fallecidoId;
    }

    public void setFallecidoId(Long fallecidoId) {
        this.fallecidoId = fallecidoId;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }
}