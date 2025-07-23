package com.example.sistemafarmacia.service;

import com.example.sistemafarmacia.model.Administrador;
import java.util.List;

public interface AdministradorService {
    
    // CRUD básico
    List<Administrador> getAllAdministradores();
    Administrador getAdministradorById(int id);
    Administrador createAdministrador(Administrador administrador);
    Administrador updateAdministrador(int id, Administrador administrador);
    void deleteAdministrador(int id);
    
    // Búsquedas esenciales
    Administrador findByUsername(String username);
    List<Administrador> findByRol(String rol);
    
    // Validaciones básicas
    boolean existsByUsername(String username);
}
