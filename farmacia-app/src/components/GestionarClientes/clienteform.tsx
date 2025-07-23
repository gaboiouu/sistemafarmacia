import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "/api/cliente";

interface ClienteFormProps {
  cliente?: {
    id?: number;
    dni?: string;
    nombres?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    telefono?: string;
    fuente_datos?: string;
    // Campos legacy para compatibilidad
    nombre?: string;
    apellidos?: string;
    email?: string;
  };
  onClose: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onClose }) => {
  const [clienteState, setCliente] = useState({
    dni: cliente?.dni || "",
    nombres: cliente?.nombres || cliente?.nombre || "",
    apellido_paterno: cliente?.apellido_paterno || "",
    apellido_materno: cliente?.apellido_materno || "",
    telefono: cliente?.telefono || "",
    fuente_datos: cliente?.fuente_datos || "MANUAL"
  });
  const [error, setError] = useState<string>("");
  const [isSearchingReniec, setIsSearchingReniec] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id && cliente) {
      setCliente({
        dni: cliente.dni || "",
        nombres: cliente.nombres || cliente.nombre || "",
        apellido_paterno: cliente.apellido_paterno || "",
        apellido_materno: cliente.apellido_materno || "",
        telefono: cliente.telefono || "",
        fuente_datos: cliente.fuente_datos || "MANUAL"
      });
    }
  }, [id, cliente]);

  const buscarEnReniec = async () => {
    if (!clienteState.dni || clienteState.dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos");
      return;
    }

    setIsSearchingReniec(true);
    setError("");

    try {
      console.log(`🔍 Buscando DNI en RENIEC: ${clienteState.dni}`);
      const response = await axios.get(`${API_URL}/reniec/${clienteState.dni}`);
      
      console.log('📡 Respuesta de RENIEC:', response.data);
      
      if (response.data && response.data.nombres) {
        setCliente({
          ...clienteState,
          nombres: response.data.nombres || "",
          apellido_paterno: response.data.apellido_paterno || "",
          apellido_materno: response.data.apellido_materno || "",
          fuente_datos: "RENIEC"
        });
        
        // Mostrar mensaje de éxito
        console.log(`✅ Datos encontrados en RENIEC: ${response.data.nombres} ${response.data.apellido_paterno} ${response.data.apellido_materno}`);
      } else {
        setError("La respuesta de RENIEC no contiene los datos esperados");
        console.log('❌ Respuesta de RENIEC vacía o inválida:', response.data);
      }
    } catch (error: any) {
      console.error('❌ Error al consultar RENIEC:', error);
      
      if (error.response?.status === 404) {
        setError("No se encontraron datos en RENIEC para este DNI");
      } else if (error.response?.status === 400) {
        setError("DNI inválido para consulta en RENIEC");
      } else {
        setError("Error al consultar RENIEC. Puede completar los datos manualmente.");
      }
      
      // Cambiar a modo manual si no se encuentra en RENIEC
      setCliente({
        ...clienteState,
        fuente_datos: "MANUAL"
      });
    } finally {
      setIsSearchingReniec(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Validación del DNI
    if (!/^\d{8}$/.test(clienteState.dni)) {
      setError("El DNI debe tener 8 dígitos");
      return;
    }

    // Validación de nombres
    if (!clienteState.nombres.trim()) {
      setError("Los nombres son requeridos");
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(clienteState.nombres)) {
      setError("Los nombres solo pueden contener letras");
      return;
    }

    // Validación de apellidos si están presentes
    if (clienteState.apellido_paterno && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(clienteState.apellido_paterno)) {
      setError("El apellido paterno solo puede contener letras");
      return;
    }

    if (clienteState.apellido_materno && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(clienteState.apellido_materno)) {
      setError("El apellido materno solo puede contener letras");
      return;
    }

    // Validación del teléfono si está presente
    if (clienteState.telefono && !/^\d{9}$/.test(clienteState.telefono)) {
      setError("El teléfono debe tener 9 dígitos");
      return;
    }

    try {
      if (cliente?.id) {
        await axios.put(`${API_URL}/${cliente.id}`, clienteState);
        alert("Cliente actualizado exitosamente.");
      } else {
        await axios.post(API_URL, clienteState);
        alert("Cliente creado exitosamente.");
      }
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
      setError("Hubo un error al guardar el cliente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cliente-form">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {cliente ? "Editar Cliente" : "Nuevo Cliente"}
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div className="modal-body">
          <div className="form-group mb-3">
            <label>DNI</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                name="dni"
                value={clienteState.dni}
                onChange={(e) =>
                  setCliente({ ...clienteState, dni: e.target.value })
                }
                maxLength={8}
                placeholder="Ingrese 8 dígitos"
                required
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={buscarEnReniec}
                disabled={isSearchingReniec || clienteState.dni.length !== 8}
              >
                {isSearchingReniec ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Buscando...
                  </>
                ) : (
                  "🔍 Buscar RENIEC"
                )}
              </button>
            </div>
            <small className="text-muted">
              {clienteState.dni.length < 8 && "Ingrese un DNI de 8 dígitos para buscar en RENIEC"}
            </small>
          </div>

          {clienteState.fuente_datos === "RENIEC" && (
            <div className="alert alert-success alert-sm mb-3">
              <i className="bi bi-check-circle me-2"></i>
              Datos obtenidos desde RENIEC
            </div>
          )}

          <div className="form-group mb-3">
            <label>Nombres {clienteState.fuente_datos === "RENIEC" && <span className="badge bg-success">RENIEC</span>}</label>
            <input
              type="text"
              className="form-control"
              name="nombres"
              value={clienteState.nombres}
              onChange={(e) =>
                setCliente({ ...clienteState, nombres: e.target.value })
              }
              placeholder="Nombres completos"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Apellido Paterno {clienteState.fuente_datos === "RENIEC" && <span className="badge bg-success">RENIEC</span>}</label>
            <input
              type="text"
              className="form-control"
              name="apellido_paterno"
              value={clienteState.apellido_paterno}
              onChange={(e) =>
                setCliente({ ...clienteState, apellido_paterno: e.target.value })
              }
              placeholder="Apellido paterno"
            />
          </div>

          <div className="form-group mb-3">
            <label>Apellido Materno {clienteState.fuente_datos === "RENIEC" && <span className="badge bg-success">RENIEC</span>}</label>
            <input
              type="text"
              className="form-control"
              name="apellido_materno"
              value={clienteState.apellido_materno}
              onChange={(e) =>
                setCliente({ ...clienteState, apellido_materno: e.target.value })
              }
              placeholder="Apellido materno"
            />
          </div>

          <div className="form-group mb-3">
            <label>Teléfono</label>
            <input
              type="tel"
              className="form-control"
              name="telefono"
              value={clienteState.telefono}
              onChange={(e) =>
                setCliente({ ...clienteState, telefono: e.target.value })
              }
              maxLength={9}
              placeholder="987654321"
            />
            <small className="text-muted">
              Opcional. Formato: 9 dígitos
            </small>
          </div>

          <div className="form-group mb-3">
            <div className="d-flex align-items-center">
              <strong className="me-2">Fuente de datos:</strong>
              <span className={`badge ${clienteState.fuente_datos === 'RENIEC' ? 'bg-success' : 'bg-secondary'}`}>
                {clienteState.fuente_datos === 'RENIEC' ? '🏛️ RENIEC' : '✏️ MANUAL'}
              </span>
            </div>
            <small className="text-muted">
              {clienteState.fuente_datos === 'RENIEC' 
                ? 'Los datos fueron obtenidos automáticamente desde RENIEC' 
                : 'Los datos fueron ingresados manualmente'}
            </small>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn-primary ">
            Guardar
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClienteForm;
