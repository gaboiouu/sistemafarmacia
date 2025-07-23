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
@RequestMapping("/api/users")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    // Listar todos
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAdministradores() {
        List<Administrador> administradores = administradorService.getAllAdministradores();
        List<Map<String, Object>> response = administradores.stream()
            .map(admin -> {
                Map<String, Object> adminMap = new HashMap<>();
                adminMap.put("id", admin.getId());
                adminMap.put("username", admin.getUsername());
                adminMap.put("nombre", admin.getUsername());
                adminMap.put("apellido", "");
                adminMap.put("email", "");
                adminMap.put("roles", List.of(Map.of("id", admin.getRol().equals("ADMINISTRADOR") ? 1 : 2, "name", admin.getRol())));
                return adminMap;
            })
            .toList();
        return ResponseEntity.ok(response);
    }

    // Crear administrador
    @PostMapping
    public ResponseEntity<?> createAdministrador(@RequestBody Map<String, Object> requestBody) {
        try {
            Administrador administrador = new Administrador();
            administrador.setUsername((String) requestBody.get("username"));
            administrador.setPassword((String) requestBody.get("password"));
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> roles = (List<Map<String, Object>>) requestBody.get("roles");
            if (roles != null && !roles.isEmpty()) {
                Integer roleId = (Integer) roles.get(0).get("id");
                administrador.setRol(roleId == 1 ? "ADMINISTRADOR" : "EMPLEADO");
            }
            
            Administrador nuevoAdmin = administradorService.createAdministrador(administrador);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", nuevoAdmin.getId());
            response.put("username", nuevoAdmin.getUsername());
            response.put("nombre", nuevoAdmin.getUsername());
            response.put("apellido", "");
            response.put("email", "");
            response.put("roles", List.of(Map.of("id", nuevoAdmin.getRol().equals("ADMINISTRADOR") ? 1 : 2, "name", nuevoAdmin.getRol())));
            
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
    public ResponseEntity<?> updateAdministrador(@PathVariable int id, @RequestBody Map<String, Object> requestBody) {
        try {
            Administrador administrador = new Administrador();
            administrador.setUsername((String) requestBody.get("username"));
            
            String password = (String) requestBody.get("password");
            if (password != null && !password.trim().isEmpty()) {
                administrador.setPassword(password);
            }
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> roles = (List<Map<String, Object>>) requestBody.get("roles");
            if (roles != null && !roles.isEmpty()) {
                Integer roleId = (Integer) roles.get(0).get("id");
                administrador.setRol(roleId == 1 ? "ADMINISTRADOR" : "EMPLEADO");
            }
            
            Administrador adminActualizado = administradorService.updateAdministrador(id, administrador);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", adminActualizado.getId());
            response.put("username", adminActualizado.getUsername());
            response.put("nombre", adminActualizado.getUsername());
            response.put("apellido", "");
            response.put("email", "");
            response.put("roles", List.of(Map.of("id", adminActualizado.getRol().equals("ADMINISTRADOR") ? 1 : 2, "name", adminActualizado.getRol())));
            
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
