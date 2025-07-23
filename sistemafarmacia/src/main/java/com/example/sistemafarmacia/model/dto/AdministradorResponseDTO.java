package com.example.sistemafarmacia.model.dto;

public class AdministradorResponseDTO {
    private int id;
    private String username;
    private String rol;
    
    // Constructores
    public AdministradorResponseDTO() {}
    
    public AdministradorResponseDTO(int id, String username, String rol) {
        this.id = id;
        this.username = username;
        this.rol = rol;
    }
    
    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}
