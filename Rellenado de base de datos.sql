

#añadimos sede 
INSERT INTO sede (activo, ciudad, direccion, nombre, telefono) VALUES (
1,'chimbote', 'Plaza Mayor #123','Alexis',977546484)

#agregamos al usuario
# email: admin@farmacia.com , password: 1234
INSERT INTO usuarios (
    username,
    password,
    nombre_completo,
    email,
    rol,
    sede_id,
    activo
) VALUES (
    'admin@farmacia.com',
    '$2a$12$zuRis6aQX7tT8HkbACnB1.VXyaXnDnZ43/pyNKd0DoJ0AQbUzaIXG',
    'Administrador General',
    'admin@farmacia.com',
    'ADMIN',
    1,
    true
);


#Agregamos productos 
INSERT INTO producto (nombre, precio, cantidad, fecha_vencimiento, descripcion, categoria) VALUES
('Paracetamol 500mg', 15.50, 100, '2025-12-31', 'Analgésico y antipirético', 'Analgésicos'),
('Ibuprofeno 400mg', 18.00, 80, '2025-11-30', 'Antiinflamatorio no esteroideo', 'Antiinflamatorios'),
('Amoxicilina 500mg', 25.00, 50, '2025-10-15', 'Antibiótico de amplio espectro', 'Antibióticos'),
('Omeprazol 20mg', 22.00, 60, '2026-01-20', 'Inhibidor de la bomba de protones', 'Gastroenterología'),
('Loratadina 10mg', 12.00, 90, '2025-09-30', 'Antihistamínico', 'Antialérgicos'),
('Acetaminofén jarabe', 20.00, 40, '2025-08-15', 'Analgésico pediátrico', 'Pediátricos'),
('Vitamina C 1000mg', 35.00, 70, '2026-03-10', 'Suplemento vitamínico', 'Vitaminas'),
('Diclofenaco gel', 28.00, 30, '2025-07-25', 'Antiinflamatorio tópico', 'Uso tópico'),
('Salbutamol inhalador', 45.00, 25, '2025-12-05', 'Broncodilatador', 'Respiratorio'),
('Metformina 850mg', 30.00, 55, '2026-02-28', 'Antidiabético', 'Endocrinología');


#añadimos unas ventas
INSERT INTO venta (idcliente, fecha_registro, precio_total) VALUES
(1, CURDATE(), 33.50);

INSERT INTO venta_detalle (idventa, idproducto, cantidad) VALUES
(1, 1, 2),  -- 2 Paracetamol
(1, 5, 1);  -- 1 Loratadina