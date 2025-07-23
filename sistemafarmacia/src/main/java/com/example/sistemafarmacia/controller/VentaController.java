package com.example.sistemafarmacia.controller;

import com.example.sistemafarmacia.model.Producto;
import com.example.sistemafarmacia.model.VentaDetalle;
import com.example.sistemafarmacia.service.ProductoService;
import com.example.sistemafarmacia.service.VentaService;
import com.example.sistemafarmacia.model.Venta;
import com.example.sistemafarmacia.model.VentaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venta")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<Venta> getAllVentas() {
        return ventaService.getAllVentas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> getVentaById(@PathVariable int id) {
        Venta venta = ventaService.getVentaById(id);
        return venta != null ? ResponseEntity.ok(venta) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Venta> addVenta(@RequestBody VentaDTO ventaDTO) {
        Venta venta = new Venta();
        venta.setIdcliente(ventaDTO.getIdcliente());
        venta.setFechaRegistro(ventaDTO.getFechaRegistro());
        venta.setPrecioTotal(ventaDTO.getPrecioTotal());

        // Registrar la venta junto con los detalles
        Venta nuevaVenta = ventaService.addVenta(venta, ventaDTO.getDetalles());

        // Actualizar inventario de productos
        for (VentaDetalle detalle : ventaDTO.getDetalles()) {
            Producto producto = productoService.getProductoById(detalle.getIdproducto());
            if (producto != null) {
                producto.setCantidad(producto.getCantidad() - detalle.getCantidad());
                productoService.updateProducto(detalle.getIdproducto(), producto);
            }
        }

        return ResponseEntity.ok(nuevaVenta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> updateVenta(@PathVariable int id, @RequestBody Venta venta) {
        Venta ventaActualizada = ventaService.updateVenta(id, venta);
        return ventaActualizada != null ? ResponseEntity.ok(ventaActualizada) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenta(@PathVariable int id) {
        ventaService.deleteVenta(id);
        return ResponseEntity.ok().build();
    }
}
