# Descanso Eterno

Sistema web para la gestión de servicios funerarios. El proyecto contempla la atención de clientes responsables, personas fallecidas, servicios funerarios, reservas, traslados, pagos, seguimiento y administración de usuarios.

## Estado actual

La interfaz funcional está disponible en `dist/` e incluye:

- Sitio público de presentación y servicios.
- Formulario de solicitud de asistencia.
- Inicio de sesión demostrativo para el personal.
- Panel general con indicadores operativos.
- Gestión simulada de clientes y personas fallecidas.
- Catálogo de servicios funerarios.
- Registro y consulta de reservas.
- Seguimiento del estado de los servicios.
- Registro de pagos.
- Administración visual de usuarios y permisos.
- Diseño adaptable para computadora y dispositivos móviles.

Los datos se almacenan localmente en el navegador para fines de demostración. La conexión con una API y una base de datos se realizará en las siguientes etapas.

## Estructura del repositorio

```text
descanso-eterno/
├── dist/          # Interfaz web actual
├── backend/       # API y lógica del servidor
├── database/      # Scripts y migraciones de la base de datos
├── docs/          # Documentación técnica y funcional
└── README.md
```

## Ejecutar la interfaz

1. Abre `dist/index.html` para visualizar el sitio público.
2. Selecciona **Acceso al sistema** o abre `dist/sistema.html`.
3. Para la demostración usa:

```text
Correo: admin@descansoeterno.pe
Contraseña: Demo2026!
```

## Forma de trabajo

- `main`: versión estable e integrada.
- `feature/CV-XX-frontend`: cambios de interfaz relacionados con una actividad de Jira.
- `feature/CV-XX-backend`: desarrollo de la API.
- `feature/CV-XX-database`: scripts y migraciones de base de datos.

Los commits deben incluir el código correspondiente de Jira, por ejemplo:

```text
CV-23: crear formulario de registro de clientes
```

## Tecnologías actuales

- HTML5
- CSS3
- JavaScript
- LocalStorage para los datos demostrativos

## Próximos pasos

- Implementar la API del backend.
- Crear el modelo y las migraciones de la base de datos.
- Configurar `API_URL` para conectar la interfaz con el backend.
- Sustituir los datos simulados por solicitudes reales mediante `fetch`.
- Añadir pruebas de integración del flujo completo.

