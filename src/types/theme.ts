export type FontId =
  | 'helvetica'
  | 'arial'
  | 'calibri'
  | 'roboto'
  | 'opensans'
  | 'verdana'
  | 'georgia'
  | 'times';

export type SpacingPreset = 'compact' | 'comfortable' | 'relaxed';
export type HeaderStyle = 'accent-bar' | 'underline' | 'simple';
export type ColumnsPreset = 1 | 2;

export interface ThemeConfig {
  accentColor: string;
  fontFamily: FontId;
  /** Tamaño base del cuerpo en puntos (10-12). */
  baseFontSize: number;
  /** Multiplicador para encabezados (1.2-1.6). */
  headingScale: number;
  spacing: SpacingPreset;
  headerStyle: HeaderStyle;
  /** Cantidad de columnas para las secciones del cuerpo (el header va a lo ancho). */
  columns: ColumnsPreset;
  nameUppercase: boolean;
  /** Muestra etiquetas de texto (Email:, Tel:) en el contacto. Texto plano = ATS-safe. */
  contactLabels: boolean;
}
