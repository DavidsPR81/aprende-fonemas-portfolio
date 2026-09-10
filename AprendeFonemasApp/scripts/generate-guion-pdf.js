// Genera docs/GUION_GRABACION_AUDIOS.pdf desde el MD
// node scripts/generate-guion-pdf.js
const path = require('path');
const fs = require('fs');
const { mdToPdf } = require('md-to-pdf');

const docsDir = path.join(__dirname, '..', 'docs');
const src = path.join(docsDir, 'GUION_GRABACION_AUDIOS.md');
const dest = path.join(docsDir, 'GUION_GRABACION_AUDIOS.pdf');

const chromeCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

async function main() {
  if (!fs.existsSync(src)) {
    throw new Error(`No existe ${src}. Ejecuta antes: npm run audio:guion`);
  }

  const executablePath = chromeCandidates.find((p) => fs.existsSync(p));
  const launch_options = {
    args: ['--no-sandbox'],
    ...(executablePath ? { executablePath } : {}),
  };

  const pdf = await mdToPdf(
    { path: src },
    {
      dest,
      launch_options,
      pdf_options: {
        format: 'A4',
        margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' },
        printBackground: true,
      },
    }
  );

  if (!pdf?.content) {
    throw new Error('No se pudo generar el PDF');
  }

  console.log('PDF generado:', dest, `(${fs.statSync(dest).size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
