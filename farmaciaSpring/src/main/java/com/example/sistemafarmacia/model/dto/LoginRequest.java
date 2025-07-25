package com.example.sistemafarmacia.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Email es requerido")
    @Email(message = "Email debe tener un formato válido")
    private String email;
    
    @NotBlank(message = "Password es requerido")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    // Método de compatibilidad para username (se mapeará al email)
    public String getUsername() {
        return this.email;
    }
    
    public void setUsername(String username) {
        this.email = username;
    }
}