import { useCallback, useEffect, useRef, useState } from 'react';
import { usePopover } from '../../hooks/usePopover';
import { CheckIcon, ChevronDownIcon } from './icons';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

/**
 * Select custom (sin <select> nativo): trigger + dropdown propio.
 * Accesible: aria-haspopup/expanded, navegación con flechas, Enter/Escape, cierre al hacer clic afuera.
 */
export function Select<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
  disabled,
  placeholder,
}: {
  options: SelectOption<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const { triggerRef, menuStyle } = usePopover(open, close);

  const selected = options.find((o) => o.value === value);

  // Cerrar al hacer clic afuera o con Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Al abrir: sincronizar el índice activo con la opción seleccionada y enfocar el menú.
  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex((o) => o.value === value);
    setActive(idx >= 0 ? idx : 0);
    menuRef.current?.focus();
  }, [open, options, value]);

  const choose = (o: SelectOption<T>) => {
    onChange(o.value);
    setOpen(false);
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const o = options[active];
      if (o) choose(o);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={[
        'select',
        className ?? '',
        open ? 'select--open' : '',
        disabled ? 'select--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        ref={triggerRef}
        type="button"
        className="select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="select-value">{selected?.label ?? placeholder ?? '—'}</span>
        <ChevronDownIcon width={14} height={14} />
      </button>
      {open && menuStyle && (
        <div
          ref={menuRef}
          className="select-menu"
          style={menuStyle}
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          onKeyDown={onMenuKey}
        >
          {options.map((o, i) => {
            const isSel = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={isSel}
                className={[
                  'select-option',
                  isSel ? 'select-option--selected' : '',
                  i === active ? 'select-option--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(o)}
              >
                <span>{o.label}</span>
                {isSel && <CheckIcon width={14} height={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
