# 🚌 Transporte Público Managua - Backend

Este backend sirve como base para una aplicación que muestra rutas de transporte público en Managua. Permite autenticación de usuarios, búsqueda de rutas, administración de rutas favoritas y visualización de datos GTFS.

## 🚀 Requisitos

- Node.js >= 18
- npm (viene con Node.js)
- Archivo `gtfs.sqlite` (proporcionado fuera de GitHub debido a su tamaño)

## 📦 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo
   
2. Instala los módulos necesarios:
   ```bash
   npm install
   ```

3. Coloca el archivo gtfs.sqlite en el directorio raíz del proyecto (junto a server.js y package.json).

## 🛠️ Scripts útiles
1. Ejecutar el servidor
 ```bash
npm run dev
```

2. Ver documentación de la API (Swagger UI)
```bash
npm run api-docs
```
Esto abrirá automáticamente tu navegador con la documentación de la API en http://localhost:3001/api-docs.

## 🔐 Autenticación
Este proyecto utiliza JSON Web Tokens (JWT). Al hacer login, se devuelve un token que debe incluirse en las rutas protegidas usando el header:
```bash
Authorization: Bearer TU_TOKEN
```

## 🗃️ Estructura de carpetas
```bash
📁 api/
 ├─ allRoutes.js        # Información general de rutas
 ├─ favorites.js        # Guardar, listar, editar y borrar rutas favoritas
 ├─ route.js            # Buscar rutas desde/hacia un destino
 ├─ routeDetails.js     # Ver detalles de una ruta
 ├─ users.js            # Registro e inicio de sesión
📁 db/
 └─ connection.js       # Conexión a SQLite
.env                    # Clave secreta JWT (no incluida por seguridad)
gtfs.sqlite             # Base de datos con datos GTFS (debes colocarla manualmente)
swagger.yaml            # Documentación de la API
```
