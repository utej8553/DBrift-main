package org.utej.backend;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PortService {

    private final JdbcTemplate jdbcTemplate;

    public PortService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public int allocatePort() {
        Integer port = jdbcTemplate.queryForObject("""
            SELECT port FROM port_pool
            WHERE allocated = false
            LIMIT 1
            FOR UPDATE
        """, Integer.class);

        if (port == null) {
            throw new RuntimeException("No free ports available");
        }

        jdbcTemplate.update(
            "UPDATE port_pool SET allocated = true WHERE port = ?",
            port
        );

        return port;
    }

    @Transactional
    public void releasePort(int port) {
        jdbcTemplate.update(
            "UPDATE port_pool SET allocated = false WHERE port = ?",
            port
        );
    }
}
