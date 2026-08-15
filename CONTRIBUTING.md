# Contribuyendo a Currito

¡Gracias por querer mejorar Currito! 🙌 Cualquier aporte suma: reportar un bug,
proponer una feature, mejorar la documentación o mandar un PR.

## Reportar un problema

Antes de abrir un issue, buscá si ya existe uno similar en
[issues](https://github.com/Martino17x/currito/issues). Si no existe, abrí uno nuevo
con:

- **Bug**: qué esperabas, qué pasó, pasos para reproducirlo, navegador/versión y
  una captura si ayuda.
- **Feature**: qué querés lograr y por qué (el "por qué" es lo más importante).

## Desarrollo

```bash
pnpm install
pnpm dev
```

Antes de mandar un PR, corré el chequeo completo:

```bash
pnpm check   # typecheck + build + smoke test SSR
```

Todo debe pasar en verde. El CI también lo verifica en cada PR.

## Pull requests

1. Hacé un fork del repo y creá una rama con nombre descriptivo
   (`fix/overflow-print`, `feat/plantilla-nueva`).
2. Commiteá con [Conventional Commits](https://www.conventionalcommits.org):
   `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`…
3. Abrí el PR contra `main`, describí qué cambia y por qué.

## Stack y convenciones

- React + TypeScript (estricto) + Vite.
- Estado con Zustand (persistencia en `localStorage`).
- Sin `<select>` nativos: todo control custom (ver `src/components/ui/Select.tsx`).
- Los presets de ejemplo viven en `src/data/defaults.ts`; si cambiás su contenido,
  bumpeá `PRESETS_VERSION` en `src/store/resumeStore.ts` para que se propague.
- Tipos del dominio en `src/types/`.

## Código de conducta

Al participar, aceptás el [Código de conducta](CODE_OF_CONDUCT.md).
