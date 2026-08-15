# Changelog

Todas las novedades notables de Currito se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [0.1.0] - 2026-08-15

### Añadido

- Editor de currículums ATS-friendly con 3 plantillas (Moderna, Clásica, Mínima).
- Tema configurable: color de acento, tipografía, tamaño de base, escala, espaciado.
- Vista previa en vivo con zoom por dispositivo (35/60/80%) y ajuste automático.
- Foto de perfil con arrastrar y soltar (optimizada y guardada localmente).
- Secciones reordenables con drag & drop y formularios de configuración.
- Panel ATS checker con detección de problemas de parseo.
- Exportar PDF (A4 real, 1 página si el contenido entra) y Exportar/Importar JSON.
- Persistencia 100% en localStorage (sin cuentas ni servidores).
- Enrutado real con React Router (`/` y `/cv/:id`) y deep-linking.
- Presets de ejemplo: CV personal (Martino) y CV comercial (datos ficticios).
- Controles custom: selects, checkboxes y sliders sin skin nativo del navegador.

### Configuración

- Deploy listo para Vercel (`vercel.json` con rewrites SPA).
- CI con GitHub Actions (typecheck + build + smoke test SSR).
- Licencia MIT, CONTRIBUTING, Código de Conducta y política de seguridad.
