# Análisis de mercado y estrategia de precios — Currito

_Fecha: agosto 2026 · Revisión de precios de los principales editores de currículums online._

## 1. Competencia y precios (2026)

| Herramienta | Free | Mensual | Anual (efectivo) | Lifetime | Notas |
| --- | --- | --- | --- | --- | --- |
| Rezi | 1 CV, 3 descargas | $29/mo | — | **$149** | 30 días de garantía |
| Kickresume | 1 CV, 1 carta | $19–24/mo | $4.50–8/mo | — | Sin lifetime |
| Resume.io | 1 CV | $29.95/mo | ~$19/mo | — | Trial trap: $2.95 → $29.95 |
| Zety | Build gratis | $25.95 / 4 sem | $5.95/mo | — | Trial trap |
| NovaResume | 1 página | $19.99/mo | $8–11/mo | — | Sin lifetime |
| FlowCV | Descargas ilimitadas | $4–5/mo | — | **$19** | Lifetime accesible |
| Teal | — | $29/mo | — | — | Orientado a búsqueda activa |
| JobSprout | — | $12/mo | — | — | |

## 2. Insights del mercado

1. **Rango mensual: $12–$30.** El anual efectivo baja a $4.50–$11/mo; el lifetime va de $19 a $149.
2. **Los "trial traps" generan mala reputación** (Zety y Resume.io están llenos de quejas por cobros automáticos). Currito **no** usa ese patrón: free tier generoso y precios claros.
3. **Dos modelos conviven**: la suscripción da ingreso recurrente, pero el **lifetime** captura al usuario que solo quiere armar su CV una vez (caso típico: estudiante o profesional que cambia de trabajo cada 2–4 años).
4. **Currito es 100 % client-side**: el costo marginal por usuario es ≈ 0 (sin servidores ni infraestructura). Esto habilita un free tier generoso y un lifetime viable a precio bajo.

## 3. Pricing propuesto

| Tier | Precio | Incluye |
| --- | --- | --- |
| **Free** | **US$0** | CVs ilimitados, plantillas Modern / Classic / Minimal, export PDF con marca Currito, check ATS básico. |
| **Pro** | **US$9/mes** o **US$59/año** (~$4.90/mes) | Todo lo de Free + todas las plantillas (Executive, Creative), PDF sin marca, export JSON Resume, columnas 1/2, preview interactivo. |
| **Lifetime** | **US$49 pago único** (badge "Mejor valor") | Acceso Pro para siempre. |

## 4. Justificación

- **Anclaje mensual en $9**: por debajo del rango de mercado ($12–30). Con marca nueva hay que compensar con precio.
- **Anual $59** ≈ 5.4 meses de Pro: incentivo claro a pagar el año.
- **Lifetime $49** (vs. $149 de Rezi): captura al usuario "solo quiero mi CV ahora" y apalanca el costo marginal ~0. El badge "Mejor valor" dirige la conversión ahí.
- **Free generoso estilo FlowCV**: baja la fricción y alimenta el funnel; el 100 % client-side permite regalar mucho sin costo.

## 5. Notas de implementación

- Los tiers son el **plan comercial actual**; la app **no restringe features todavía** (el gating Pro queda documentado como feature futura con backend/pasarela).
- **Pago v1**: botones de la landing apuntan a un **Payment Link** (Stripe / Mercado Pago) que configura el dueño del proyecto. Sin auth ni backend.
- Moneda: **USD** para el mercado internacional; se puede adaptar a ARS para el público local.
