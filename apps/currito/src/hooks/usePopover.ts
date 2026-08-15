import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * Menú flotante anclado al trigger con `position: fixed`.
 *
 * ¿Por qué fixed y no absolute dentro del contenedor? Porque los selects viven
 * dentro de contenedores con `overflow: auto` (drawers, paneles scrolleables,
 * header sticky): un menú absolute ahí se recorta o queda descolgado del trigger
 * al scrollear. Fixed contra el viewport garantiza que el menú aparezca SIEMPRE
 * justo debajo del botón que lo abrió, sin importar el contexto.
 *
 * - `transform-origin` en el borde del trigger (regla de popover de skills.sh).
 * - Si no entra abajo, se voltea hacia arriba.
 * - Cualquier scroll cierra el menú (el trigger se movió; mantenerlo anclado es peor).
 */
export type PopoverAlign = 'left' | 'right';

const MENU_MAX_HEIGHT = 260;
const GAP = 4;

// En SSR (smoke test) useLayoutEffect no aplica; usar useEffect sin romper nada.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function usePopover(
  open: boolean,
  onClose: () => void,
  opts: { align?: PopoverAlign; minWidth?: number } = {},
) {
  const { align = 'left', minWidth = 180 } = opts;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

  useIsoLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    if (!trigger) return;
    const initial = trigger.getBoundingClientRect();

    const update = () => {
      const r = trigger.getBoundingClientRect();
      const width = Math.min(Math.max(r.width, minWidth), window.innerWidth - GAP * 2);
      const fitsBelow = r.bottom + GAP + MENU_MAX_HEIGHT <= window.innerHeight;
      const top = fitsBelow ? r.bottom + GAP : Math.max(GAP, r.top - GAP - MENU_MAX_HEIGHT);
      setMenuStyle(
        align === 'right'
          ? { position: 'fixed', top, right: window.innerWidth - r.right, width, zIndex: 300 }
          : { position: 'fixed', top, left: r.left, width, zIndex: 300 },
      );
    };

    // En mobile, tocar una opción dispara micro-scrolls fantasma (scroll chaining /
    // touch) que cerraban el menú antes del click. Solo cerramos si el trigger
    // realmente se movió >10px (scroll real del documento o del contenedor).
    const onScroll = () => {
      const r = trigger.getBoundingClientRect();
      const moved = Math.abs(r.top - initial.top) + Math.abs(r.left - initial.left);
      if (moved > 10) {
        onClose();
      } else {
        update(); // mantiene el menú pegado al trigger ante movimientos mínimos
      }
    };

    update();
    window.addEventListener('resize', update);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('resize', update);
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [open, onClose, align, minWidth]);

  return { triggerRef, menuStyle };
}
