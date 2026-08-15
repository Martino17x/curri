import type { ReactNode } from 'react';
import { MESES_CORTO } from '../../lib/dates';
import type { DateRef } from '../../types/resume';
import { Select } from '../ui/Select';

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="field field--toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function MonthYearPicker({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: DateRef | null;
  onChange: (v: DateRef | null) => void;
  disabled?: boolean;
}) {
  return (
    <div className="month-year">
      <span className="field-label">{label}</span>
      <div className="month-year-inputs">
        <Select
          className="select--month"
          options={[
            { value: '', label: 'Mes' },
            ...MESES_CORTO.slice(1).map((m, i) => ({ value: String(i + 1), label: m })),
          ]}
          value={value?.month ? String(value.month) : ''}
          disabled={disabled}
          onChange={(v) => {
            const month = v ? Number(v) : undefined;
            onChange(value ? { ...value, month } : { year: new Date().getFullYear(), month });
          }}
          ariaLabel="Mes"
        />
        <input
          type="number"
          min={1950}
          max={2100}
          placeholder="Año"
          value={value?.year ?? ''}
          disabled={disabled}
          onChange={(e) => {
            const year = Number(e.target.value);
            if (Number.isNaN(year)) return;
            onChange(value ? { ...value, year } : { year });
          }}
        />
      </div>
    </div>
  );
}

export function DateRangeFields({
  start,
  end,
  current,
  onStart,
  onEnd,
  onCurrent,
  currentLabel = 'Actual / en curso',
}: {
  start: DateRef | null;
  end: DateRef | null;
  current: boolean;
  onStart: (v: DateRef | null) => void;
  onEnd: (v: DateRef | null) => void;
  onCurrent: (v: boolean) => void;
  currentLabel?: string;
}) {
  return (
    <div className="date-range-fields">
      <MonthYearPicker label="Inicio" value={start} onChange={onStart} />
      {!current && <MonthYearPicker label="Fin" value={end} onChange={onEnd} />}
      <label className="field field--toggle">
        <input type="checkbox" checked={current} onChange={(e) => onCurrent(e.target.checked)} />
        <span>{currentLabel}</span>
      </label>
    </div>
  );
}

export function StringListEditor({
  values,
  onChange,
  placeholder,
  addLabel = 'Agregar ítem',
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <div className="string-list">
      {values.map((v, i) => (
        <div className="string-row" key={i}>
          <input
            value={v}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button type="button" className="btn-icon" title="Quitar" onClick={() => onChange(values.filter((_, j) => j !== i))}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn-secondary" onClick={() => onChange([...values, ''])}>
        + {addLabel}
      </button>
    </div>
  );
}

export function ListEditor<T extends { id: string }>({
  items,
  onChange,
  makeItem,
  renderItem,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  makeItem: () => T;
  renderItem: (item: T, patch: (p: Partial<T>) => void) => ReactNode;
  addLabel: string;
}) {
  return (
    <div className="list-editor">
      {items.map((item) => (
        <div className="item-card" key={item.id}>
          <div className="item-card-head">
            <span className="item-card-num">◦</span>
            <button
              type="button"
              className="btn-link-danger"
              onClick={() => onChange(items.filter((x) => x.id !== item.id))}
            >
              Quitar
            </button>
          </div>
          {renderItem(item, (patch) => onChange(items.map((x) => (x.id === item.id ? { ...x, ...patch } : x))))}
        </div>
      ))}
      <button type="button" className="btn-secondary" onClick={() => onChange([...items, makeItem()])}>
        + {addLabel}
      </button>
    </div>
  );
}

export function CommaInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <TextField
      label={label}
      value={value.join(', ')}
      placeholder="React, TypeScript, CSS"
      onChange={(v) => onChange(v.split(',').map((s) => s.trim()).filter(Boolean))}
    />
  );
}
