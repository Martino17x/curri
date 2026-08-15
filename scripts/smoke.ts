import { createSampleResume } from '../src/data/defaults';
import { buildStandaloneHtml } from '../src/lib/exportPdf';

const html = buildStandaloneHtml(createSampleResume());

const checks: Array<[string, string]> = [
  ['nombre', 'Martino Costigliolo'],
  ['título', 'Desarrollador de Software'],
  ['email', 'martinoldcostigliolo@gmail.com'],
  ['header experiencia', 'Experiencia laboral'],
  ['empresa', 'Cuenca Hogar'],
  ['fecha rango', 'Feb 2025 – Nov 2025'],
  ['header formación', 'Formación'],
  ['técnico', 'Técnico Superior en Desarrollo de Software'],
  ['header competencias', 'Competencias'],
  ['skill React', 'React'],
  ['skill gestión', 'Gestión de proyectos'],
  ['header proyectos', 'Proyectos'],
  ['proyecto 1', 'Equarys'],
  ['url proyecto', 'equarys.com'],
  ['proyecto 2', 'Sentinel Tracker'],
];

const missing = checks.filter(([, needle]) => !html.includes(needle));

console.log(`HTML generado: ${html.length} caracteres`);
console.log(`Contiene doctype: ${html.startsWith('<!DOCTYPE html>')}`);
console.log(`Contiene estilos inline: ${html.includes('<style>')}`);
console.log(`Contiene doc-page: ${html.includes('class="doc-page"')}`);

if (missing.length) {
  console.error('FALTAN:', missing.map(([label]) => label).join(', '));
  process.exit(1);
}

console.log('SMOKE OK: el CV de ejemplo renderiza con todas las secciones.');
