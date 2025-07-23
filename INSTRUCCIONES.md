# Sistema de Farmacia - Guía de Inicio Rápido

## 🚀 Inicio Automático (Recomendado)

### Opción 1: Script de PowerShell
```powershell
# Ejecutar desde la carpeta raíz del proyecto
.\iniciar-sistema.ps1
```

### Opción 2: Script de Bash (Git Bash/WSL)
```bash
# Ejecutar desde la carpeta raíz del proyecto
./iniciar-sistema.sh
```

## 📋 Inicio Manual

### 1. Iniciar el Backend (Spring Boot)
```bash
# Terminal 1: Navegar a la carpeta del backend
cd farmaciaSpring

# Iniciar el servidor Spring Boot
mvn spring-boot:run
```

**✅ Verificar:** El backend debe mostrar "Started SistemafarmaciaApplication" y estar en `http://localhost:8010`

### 2. Iniciar el Frontend (React + Vite)
```bash
# Terminal 2: Navegar a la carpeta del frontend
cd farmacia-app

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

**✅ Verificar:** El frontend debe estar corriendo en `http://localhost:5173`

## 👥 Usuarios de Prueba

| Rol | Usuario | Contraseña | Permisos |
|-----|---------|------------|----------|
| 👨‍💼 **Administrador** | `admin1` | `admin123` | Acceso completo |
| 👤 **Vendedor** | `vendedor1` | `vend123` | Limitado |

## 🔧 Solución de Problemas

### ❌ Error 403: "Acceso Denegado" (MÁS COMÚN)
**Causa:** El backend Spring Boot no está ejecutándose.

**Solución rápida:**
1. Abre **PowerShell como administrador**
2. Ejecuta: `cd "d:\Sistema-Farmacia-main"`
3. Ejecuta: `.\diagnostico.ps1` (para ver el estado completo)
4. O directamente: `.\iniciar-sistema.ps1`

**Solución manual:**
1. Abre PowerShell como administrador
2. `cd "d:\Sistema-Farmacia-main\farmaciaSpring"`
3. `mvn spring-boot:run`
4. Espera a ver: **"Started SistemafarmaciaApplication in X.X seconds"**
5. En el login, haz clic en **"Probar Conexión"**
6. Debe aparecer **"Servidor Conectado"** en verde
7. Intenta el login nuevamente

### ❌ Error: "Servidor no disponible"
**Causa:** El backend Spring Boot no está ejecutándose.

**Solución:** Igual que el error 403 arriba.

### ❌ Error: "ECONNREFUSED" o "Network Error"
**Causa:** El proxy no puede conectar con el backend.

**Solución:**
1. Verifica que el backend esté en el puerto 8010
2. Reinicia el frontend: `Ctrl+C` y luego `npm run dev`

### ❌ Error: "Maven not found"
**Causa:** Maven no está instalado.

**Solución:**
1. Instala Maven desde: https://maven.apache.org/download.cgi
2. Agrega Maven al PATH del sistema
3. Reinicia la terminal

### ❌ Error: "Node not found"
**Causa:** Node.js no está instalado.

**Solución:**
1. Instala Node.js desde: https://nodejs.org/
2. Reinicia la terminal

## 📱 Funcionalidades por Rol

### 👨‍💼 Administrador (ADMIN)
- ✅ Dashboard de inicio
- ✅ Gestión de Usuarios
- ✅ Gestión de Productos  
- ✅ Gestión de Clientes
- ✅ Realizar Ventas
- ✅ Ver Inventarios

### 👤 Vendedor (VENDEDOR)  
- ✅ Dashboard de inicio
- ✅ Gestión de Clientes
- ✅ Realizar Ventas
- ✅ Ver Inventarios

## 🌐 URLs del Sistema

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:5173 | Interfaz de usuario |
| Backend | http://localhost:8010 | API REST |
| Autenticación | http://localhost:8010/authenticate | Endpoint de login |

## 📋 Verificación del Sistema

1. **Abrir:** http://localhost:5173
2. **Buscar:** El botón "Probar Conexión" en el login
3. **Verificar:** 
   - ✅ Verde = Conectado correctamente
   - ❌ Rojo = Servidor desconectado (revisar backend)

## 🗂️ Estructura del Proyecto

```
Sistema-Farmacia-main/
├── farmacia-app/          # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Servicios de API
│   │   └── types/         # Tipos TypeScript
│   ├── package.json
│   └── vite.config.ts     # Configuración del proxy
├── farmaciaSpring/        # Backend Spring Boot
│   ├── src/main/java/
│   ├── pom.xml
│   └── application.properties
├── iniciar-sistema.ps1    # Script de inicio (PowerShell)
├── iniciar-sistema.sh     # Script de inicio (Bash)
└── INSTRUCCIONES.md       # Este archivo
```
