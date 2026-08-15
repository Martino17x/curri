import { writeFileSync } from 'node:fs';
import { createSampleResume } from '../src/data/defaults';
import { buildStandaloneHtml } from '../src/lib/exportPdf';

const out = process.env.TEMP + '/curri-standalone.html';
writeFileSync(out, buildStandaloneHtml(createSampleResume()));
console.log('escrito en ' + out);
