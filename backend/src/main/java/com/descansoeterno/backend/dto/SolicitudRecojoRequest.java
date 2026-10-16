package com.descansoeterno.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class SolicitudRecojoRequest {

    @NotNull(message = "Debe seleccionar a la persona fallecida")
    @Positive(message = "El fallecido seleccionado no es válido")
    private Long fallecidoId;

    @NotBlank(message = "La dirección de recojo es obligatoria")
    private String direccionRecojo;

    @NotNull(message = "La fecha de recojo es obligatoria")
    private LocalDate fechaRecojo;

    @NotNull(message = "La hora de recojo es obligatoria")
    private LocalTime horaRecojo;

    private String referencia;

    public Long getFallecidoId() {
        return fallecidoId;
    }

    public void setFallecidoId(Long fallecidoId) {
        this.fallecidoId = fallecidoId;
    }

    public String getDireccionRecojo() {
        return direccionRecojo;
    }

    public void setDireccionRecojo(String direccionRecojo) {
        this.direccionRecojo = direccionRecojo;
    }

    public LocalDate getFechaRecojo() {
        return fechaRecojo;
    }

    public void setFechaRecojo(LocalDate fechaRecojo) {
        this.fechaRecojo = fechaRecojo;
    }

    public LocalTime getHoraRecojo() {
        return horaRecojo;
    }

    public void setHoraRecojo(LocalTime horaRecojo) {
        this.horaRecojo = horaRecojo;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }
}