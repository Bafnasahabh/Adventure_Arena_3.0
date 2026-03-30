import fs from 'fs';
import QRCode from 'qrcode';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'meme_qrs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const numQRs = 10;

async function run() {
  console.log('Generating Meme QR Codes...');
  try {
    for (let c = 1; c <= numQRs; c++) {
      const clueStr = `meme_qr_${c}`;
      await QRCode.toFile(path.join(outDir, `${clueStr}.png`), clueStr, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e3a8a',  // Dark blue
          light: '#f1f5f9' // Light gray
        }
      });
    }
    console.log(`Successfully generated ${numQRs} physical Meme QR codes in '${outDir}'!`);
  } catch (error) {
    console.error('Error generating Meme QR codes:', error);
  }
}

run();
