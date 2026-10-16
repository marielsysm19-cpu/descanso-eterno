package com.descansoeterno.backend.repository;

import com.descansoeterno.backend.dto.ClienteRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ClienteRepository {

    private final JdbcTemplate jdbcTemplate;

    public ClienteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int registrar(ClienteRequest cliente) {

        String sql = """
                INSERT INTO clientes
                (nombres, apellidos, documento, telefono, correo)
                VALUES (?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                cliente.getNombres(),
                cliente.getApellidos(),
                cliente.getDocumento(),
                cliente.getTelefono(),
                cliente.getCorreo()
        );
    }
}