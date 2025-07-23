import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "/api/users";
interface Role {
  id: number;
  name: string;
}
interface UsuarioFormProps {
  usuario?: {
    id:string,
    username: string;
    password: string;
    nombre: string;
    apellido: string;
    email: string;
    roles: Role[];
  };
  onClose: () => void; // Prop para manejar el cierre del modal
}


const UsuarioForm: React.FC<UsuarioFormProps> = ({ usuario, onClose }) => {
  const [usuarioState, setUsuario] = useState(
    usuario || { username: "", password: "", nombre: "", apellido: "", email: "", 
      roles: [{ id: 1, name: "ADMINISTRADOR" }],  // Inicializamos con un rol por defecto
    }
  );
  const [error, setError] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const usuarioEditar = JSON.parse(
        localStorage.getItem("usuarioEditar") || "{}"
      );
      setUsuario(usuarioEditar);
    }
  }, [id]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoleId = Number(event.target.value);
    const roleName = selectedRoleId === 1 ? "ADMINISTRADOR" : "EMPLEADO";
    setUsuario({
      ...usuarioState,
      roles: [{ id: selectedRoleId, name: roleName }],
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Validación de los campos
    if (!usuarioState.username.trim()) {
      setError("El usuario es requerido");
      return;
    }

    if (!usuario && !usuarioState.password.trim()) {
      setError("La contraseña es requerida");
      return;
    }
  


    try {
      debugger;
      
      if (usuario) {
        await axios.put(`${API_URL}/${usuario.id}`, usuarioState);
        alert("usuario actualizado exitosamente.");
      } else {
        await axios.post(API_URL, usuarioState);
        alert("usuario creado exitosamente.");
      }
      localStorage.removeItem("usuarioEditar");
      onClose(); // Cerrar el modal
      window.location.reload(); // Recargar para ver los cambios
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      setError("Hubo un error al guardar el usuario");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="usuario-form">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {usuario ? "Editar usuario" : "Nuevo usuario"}
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
            <label>Usuario</label>
            <input
              type="text"
              className="form-control"
              name="usuario"
              value={usuarioState.username}
              onChange={(e) =>
                setUsuario({ ...usuarioState, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group mb-3">
            <label> {usuario ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</label>
            <input
              type="text"
              className="form-control"
              name="password"
              value={usuarioState.password}
              onChange={(e) =>
                setUsuario({ ...usuarioState, password: e.target.value })
              }
              placeholder={usuario ? 'Dejar en blanco para mantener la contraseña actual' : ''}
              required={!usuario}
            />
          </div>

          <div className="form-group mb-3">
              <label>Rol</label>
              <select
              className="form-control"
              value={usuarioState.roles[0]?.id || ""}
              onChange={handleRoleChange}
              required
            >
              <option value="1">ADMINISTRADOR</option>
              <option value="2">EMPLEADO</option>
            </select>
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

export default UsuarioForm;
