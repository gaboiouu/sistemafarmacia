package com.example.sistemafarmacia.dto;

import com.example.sistemafarmacia.model.VentaDetalle;
import com.example.sistemafarmacia.model.Sede;
import java.time.LocalDate;
import java.util.List;

public class VentaConDetallesDTO {
    private int id;
    private int idcliente;
    private LocalDate fechaRegistro;
    private double precioTotal;
    private Sede sede;
    private List<VentaDetalle> detalles;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getIdcliente() { return idcliente; }
    public void setIdcliente(int idcliente) { this.idcliente = idcliente; }
    public LocalDate getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDate fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    public double getPrecioTotal() { return precioTotal; }
    public void setPrecioTotal(double precioTotal) { this.precioTotal = precioTotal; }
    public Sede getSede() { return sede; }
    public void setSede(Sede sede) { this.sede = sede; }
    public List<VentaDetalle> getDetalles() { return detalles; }
    public void setDetalles(List<VentaDetalle> detalles) { this.detalles = detalles; }
}
