package com.example.sistemafarmacia.controller;

import com.example.sistemafarmacia.model.Administrador;
import com.example.sistemafarmacia.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    // Listar todos
    @GetMapping
    public ResponseEntity<List<Administrador>> getAllAdministradores() {
        List<Administrador> administradores = administradorService.getAllAdministradores();
        return ResponseEntity.ok(administradores);
    }

    // Crear administrador
    @PostMapping
    public ResponseEntity<?> createAdministrador(@RequestBody Administrador administrador) {
        try {
            Administrador nuevoAdmin = administradorService.createAdministrador(administrador);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("admin", Map.of(
                "id", nuevoAdmin.getId(),
                "username", nuevoAdmin.getUsername(),
                "rol", nuevoAdmin.getRol()
            ));
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Actualizar administrador
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdministrador(@PathVariable int id, @RequestBody Administrador administrador) {
        try {
            Administrador adminActualizado = administradorService.updateAdministrador(id, administrador);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("admin", Map.of(
                "id", adminActualizado.getId(),
                "username", adminActualizado.getUsername(),
                "rol", adminActualizado.getRol()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Eliminar administrador
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdministrador(@PathVariable int id) {
        try {
            administradorService.deleteAdministrador(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Administrador eliminado exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
