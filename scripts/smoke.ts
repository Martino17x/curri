import { createSampleResume } from '../src/data/defaults';
import { buildStandaloneHtml } from '../src/lib/exportPdf';

const html = buildStandaloneHtml(createSampleResume());

const checks: Array<[string, string]> = [
  ['nombre', 'Sofía Herrera'],
  ['título', 'Desarrolladora Frontend'],
  ['email', 'sofia.herrera@email.com'],
  ['header experiencia', 'Experiencia laboral'],
  ['empresa', 'Nubel S.A.'],
  ['fecha rango', 'Mar 2024 – Presente'],
  ['header habilidades', 'Habilidades'],
  ['skill React', 'React'],
  ['header idiomas', 'Idiomas'],
  ['proyecto', 'Curri — editor de CV'],
  ['certificación', 'Fundamentos de AWS Cloud'],
  ['intereses', 'Ajedrez'],
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
