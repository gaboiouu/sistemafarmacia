import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthService from '../services/AuthService';
import { User } from '../types/Auth';
import '../Login.css';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await AuthService.login(username, password);
      if (user) {
        onLoginSuccess(user);
        setError('');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error: any) {
      setError(error.message || 'Error en el inicio de sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="text-center mb-4">
            <img
              src="../src/assets/LogoEmpresa.png"
              alt="Logo"
              className="login-logo mb-3"
            />
            <h2 className="login-title">Bienvenido a Farmacia Ávila</h2>
            <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="username">Usuario</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Contraseña</label>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-100 btn-lg ${isLoading ? 'disabled' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;