# Currito

> Editor de currículums compatibles con ATS + landing page. 100 % client-side, open source.

[![CI](https://github.com/Martino17x/currito/actions/workflows/ci.yml/badge.svg)](https://github.com/Martino17x/currito/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Monorepo **pnpm + Turborepo** con dos aplicaciones:

| App | Stack | Descripción |
| --- | --- | --- |
| [`apps/currito`](apps/currito) | React + Vite + TypeScript | Editor de currículums ATS-friendly. Tus datos nunca salen de tu navegador. |
| [`apps/landing`](apps/landing) | Astro + View Transitions | Landing page de marketing con páginas de precios y plantillas. |

## Requisitos

- **Node** 20+ (recomendado: 22 LTS)
- **pnpm** 10+

## Desarrollo

```bash
pnpm install        # instala todo el workspace
pnpm dev            # corre ambas apps a la vez (Turborepo)
pnpm --filter currito dev    # solo el editor
pnpm --filter landing dev    # solo la landing
```

## Build y checks

```bash
pnpm check          # typecheck + build + smoke test de las dos apps
pnpm build          # build de producción (Turborepo, con caché)
```

## Análisis de mercado

Ver [`docs/market-analysis.md`](docs/market-analysis.md) — pricing propuesto para Currito (Free / Pro / Lifetime).

## Licencia

MIT — ver [`LICENSE`](LICENSE).
