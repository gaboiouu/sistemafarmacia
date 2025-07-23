package com.example.sistemafarmacia.model;

import jakarta.persistence.*;

@Entity
@Table(name = "administradores")    
public class Administrador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, length = 30)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String rol; 

    public enum Rol {
        ADMINISTRADOR, 
        EMPLEADO
    }

    // Constructor vacío
    public Administrador() {}

    // Constructor completo
    public Administrador(String username, String password, String rol) {
        this.username = username;
        this.password = password;
        this.rol = rol;
    }

    // Getters y Setters
    public int getId() {    
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRol() { return rol;}
    public void setRol(String rol) { this.rol = rol; }
}
