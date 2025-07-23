package com.example.sistemafarmacia.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.sistemafarmacia.model.Administrador;
import com.example.sistemafarmacia.repository.AdministradorRepository;

import java.util.Collections;
@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private AdministradorRepository administradorRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Administrador admin = administradorRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Crear autoridad basada en el rol del administrador
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + admin.getRol());

        System.out.println("Usuario encontrado: " + admin.getUsername());
        System.out.println("Rol del usuario: " + authority.getAuthority());

        return new org.springframework.security.core.userdetails.User(
                admin.getUsername(),
                admin.getPassword(),
                Collections.singletonList(authority)
        );
    }
}

