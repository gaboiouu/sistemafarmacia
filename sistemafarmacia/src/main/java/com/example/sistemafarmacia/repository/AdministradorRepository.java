package com.example.sistemafarmacia.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sistemafarmacia.model.Administrador;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    
    // Método para encontrar un administrador por su username
    Optional<Administrador> findByUsername(String username);
    
    // Método para verificar si un administrador existe por su username
    boolean existsByUsername(String username);
    
    // Método para buscar por rol
    List<Administrador> findByRol(String rol);
    
    // Método para obtener todos ordenados por username
    List<Administrador> findAllByOrderByUsernameAsc();
}
