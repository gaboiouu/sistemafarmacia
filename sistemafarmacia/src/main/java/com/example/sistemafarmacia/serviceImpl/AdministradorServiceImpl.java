package com.example.sistemafarmacia.serviceImpl;

import com.example.sistemafarmacia.model.Administrador;
import com.example.sistemafarmacia.repository.AdministradorRepository;
import com.example.sistemafarmacia.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class AdministradorServiceImpl implements AdministradorService {
    
    @Autowired
    private AdministradorRepository administradorRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Patrón para validar contraseña fuerte
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );
    
    // ❌ ELIMINADO: método login() - ahora se maneja por CustomUserDetailsServiceImpl
    
    @Override
    public List<Administrador> getAllAdministradores() {
        return administradorRepository.findAllByOrderByUsernameAsc();
    }
    
    @Override
    public Administrador getAdministradorById(int id) {
        return administradorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado con ID: " + id));
    }
    
    @Override
    public Administrador createAdministrador(Administrador administrador) {
        System.out.println("=== CREANDO ADMINISTRADOR ===");
        System.out.println("Username: " + administrador.getUsername());
        System.out.println("Password original: " + administrador.getPassword());
        
        // Validar que no exista el username
        if (administradorRepository.existsByUsername(administrador.getUsername())) {
            throw new RuntimeException("El username ya existe");
        }
        
        // Validar contraseña fuerte ANTES de encriptar
        if (!esPasswordFuerte(administrador.getPassword())) {
            throw new RuntimeException("La contraseña debe tener al menos 8 caracteres, " +
                "incluir mayúsculas, minúsculas, números y caracteres especiales (@$!%*?&)");
        }
        
        // Validar rol
        if (!esRolValido(administrador.getRol())) {
            throw new RuntimeException("Rol inválido. Debe ser ADMINISTRADOR o EMPLEADO");
        }
        
        // Encriptar la contraseña antes de guardar
        String passwordEncriptada = passwordEncoder.encode(administrador.getPassword());
        administrador.setPassword(passwordEncriptada);
        
        System.out.println("Password encriptada: " + passwordEncriptada);
        
        return administradorRepository.save(administrador);
    }
    
    @Override
    public Administrador updateAdministrador(int id, Administrador administrador) {
        Administrador adminExistente = getAdministradorById(id);
        
        // Validar username único si se está cambiando
        if (!adminExistente.getUsername().equals(administrador.getUsername()) && 
            administradorRepository.existsByUsername(administrador.getUsername())) {
            throw new RuntimeException("El username ya existe");
        }
        
        // Validar rol
        if (!esRolValido(administrador.getRol())) {
            throw new RuntimeException("Rol inválido. Debe ser ADMINISTRADOR o EMPLEADO");
        }
        
        // Actualizar campos
        adminExistente.setUsername(administrador.getUsername());
        adminExistente.setRol(administrador.getRol());
        
        // Solo encriptar la contraseña si se está actualizando
        if (administrador.getPassword() != null && !administrador.getPassword().isEmpty()) {
            if (!esPasswordFuerte(administrador.getPassword())) {
                throw new RuntimeException("La contraseña debe tener al menos 8 caracteres, " +
                    "incluir mayúsculas, minúsculas, números y caracteres especiales (@$!%*?&)");
            }
            adminExistente.setPassword(passwordEncoder.encode(administrador.getPassword()));
        }
        
        return administradorRepository.save(adminExistente);
    }
    
    @Override
    public void deleteAdministrador(int id) {
        if (!administradorRepository.existsById(id)) {
            throw new RuntimeException("Administrador no encontrado con ID: " + id);
        }
        administradorRepository.deleteById(id);
    }
    
    @Override
    public Administrador findByUsername(String username) {
        return administradorRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
    }
    
    @Override
    public List<Administrador> findByRol(String rol) {
        if (!esRolValido(rol)) {
            throw new RuntimeException("Rol inválido. Debe ser ADMINISTRADOR o EMPLEADO");
        }
        return administradorRepository.findByRol(rol);
    }
    
    @Override
    public boolean existsByUsername(String username) {
        return administradorRepository.existsByUsername(username);
    }
    
    // Métodos privados de validación
    private boolean esRolValido(String rol) {
        return "ADMINISTRADOR".equals(rol) || "EMPLEADO".equals(rol);
    }
    
    private boolean esPasswordFuerte(String password) {
        if (password == null || password.trim().isEmpty()) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }
}
