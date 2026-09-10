// Overlay "Sin publicidad · Offline" on Play Store feature graphic
// node scripts/update-feature-graphic.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { PNG } = require('pngjs');

const imgPath = path.join(__dirname, '..', 'docs', 'play-store', 'feature-graphic-1024x500.png');

async function main() {
  const b64 = fs.readFileSync(imgPath).toString('base64');
  const html = `<!DOCTYPE html><html><head><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1024px;height:500px;overflow:hidden;background:#E8F4FC}
  .wrap{position:relative;width:1024px;height:500px}
  img{position:absolute;inset:0;width:1024px;height:500px;display:block}
  .line{position:absolute;left:72px;bottom:78px;
    font-family:"Nunito","Segoe UI",Arial,sans-serif;
    font-weight:700;font-size:28px;letter-spacing:0.2px;color:#1B3A5C;
    text-shadow:0 1px 0 rgba(255,255,255,0.4)}
  </style></head><body><div class="wrap">
  <img src="data:image/png;base64,${b64}" alt="" />
  <div class="line">Sin publicidad · Offline</div>
  </div></body></html>`;

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({
    path: imgPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1024, height: 500 },
  });
  await browser.close();

  const png = PNG.sync.read(fs.readFileSync(imgPath));
  console.log('Feature graphic actualizado:', png.width + 'x' + png.height, fs.statSync(imgPath).size, 'bytes');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
