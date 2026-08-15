# Curri — Editor de CV compatible con ATS

Editor de currículums 100% client-side hecho con **React + TypeScript + Vite**.
Todo se guarda en el navegador (localStorage): no hay servidor ni cuentas.

## ✨ Features

- **Multi-CV**: creá, duplicá y borrá varios documentos.
- **Secciones dinámicas**: agregá, eliminá, ocultá, renombrá y **reordená con drag & drop**
  (incluye secciones personalizadas).
- **3 plantillas** (todas single-column, ATS-safe): Moderna, Clásica y Mínima.
- **Tema en vivo**: color de acento, tipografía (ATS-safe), tamaño, espaciado y estilo de títulos.
- **Preview A4 en tiempo real** con zoom, **auto-ajuste** al área visible por defecto
  (el documento completo siempre se ve entero) y **detector de desborde** de página.
- **Responsive + toggle de preview** en mobile: la vista previa se muestra/oculta con un
  botón en vez de obligar a scrollear hasta el final.
- **Navegación interna de secciones**: tocar una sección (o el ⚙) abre su configuración
  en el mismo panel, con botón "Volver".
- **ATS Checker**: valida en vivo formato de fechas, headers estándar, contacto, fuentes y más.
- **Export PDF** (texto seleccionable, A4) y **Export/Import JSON**
  (también importa el estándar [JSON Resume](https://jsonresume.org/schema/)).
- **Foto de perfil** opcional, procesada en el navegador (canvas → JPEG).
- Atajos: `Ctrl+P` exporta PDF, `Ctrl+S` exporta JSON.

## 🧰 Stack

| Herramienta | Uso |
|---|---|
| Vite 8 | Bundler y dev server |
| React 19 + TypeScript (strict) | UI y tipos |
| Zustand (persist) | Estado global + autosave en localStorage |
| @dnd-kit | Reordenamiento de secciones |
| react-dom/server | Generación del HTML para el PDF |

Solo **6 dependencias**. Cero servidor, cero cuenta, 100% privado.

## 🚀 Arrancar

```bash
pnpm install
pnpm dev        # dev server en http://localhost:5173
pnpm typecheck  # tsc --noEmit
pnpm build      # build de producción en dist/
```

## 🧱 Arquitectura

```
src/
  types/        # Modelo de datos (Resume, Section, ThemeConfig)
  data/         # Defaults, fábricas de secciones, CV de ejemplo
  store/        # Zustand: resumeStore (persist) + uiStore
  lib/          # dates, fonts, ATS checker, export PDF/JSON
  components/
    templates/  # Plantillas (Modern/Classic/Minimal) + SectionView
    preview/    # Preview A4 con zoom y detección de overflow
    editor/     # Formularios por tipo de sección + fields + foto
    panels/     # Secciones (dnd), Tema, ATS Checker
    layout/     # Header, lista de CVs, Builder
  styles/       # tokens (CSS vars), UI, plantillas
```

**La idea central:** un CV es un **array ordenado de secciones autocontenidas**.
El orden del array = el orden del CV. Cada sección sabe renderizarse sola
(`SectionView`) y las plantillas solo controlan la "carcasa" (header, títulos, tipografía).
El tema se aplica con **CSS variables** derivadas de `ThemeConfig`, así cambiar
el tema es cambiar datos, no CSS hardcodeado.

## 🤖 Reglas ATS aplicadas (research 2026)

- **Una columna**: la más segura para el parseo (benchmark: 100/100 vs 85 en dos columnas).
- **Fechas estructuradas** `MM/YYYY` + "Presente": nunca "2022-2023" ni "Verano 2023".
- **Headers estándar**: el ATS mapea la sección por su título; por eso el checker avisa si renombrás.
- **Sin iconos ni barras de progreso**: el checker promueve etiquetas de texto.
- **Fuentes del sistema**: el selector solo permite fuentes ATS-safe.
- **Contacto en el cuerpo de la página 1** (nunca en header/footer de página).
- **PDF con texto seleccionable**: se genera vía impresión del documento HTML, sin imágenes.

## 📌 Próximos pasos (fuera del alcance v1)

- Paginación multi-página con continuidad de secciones.
- Rich text (Tiptap) para descripciones.
- Export a JSON Resume (no solo import).
- Carta de presentación como tipo de documento.
- Modo oscuro para la UI del editor.
