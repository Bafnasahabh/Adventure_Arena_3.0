import fs from 'fs';
import QRCode from 'qrcode';
import path from 'path';

const outDir = path.join(process.cwd(), 'pirate_qr_codes');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const teams = 10;
const cluesPerTeam = 6;

async function run() {
  console.log('Generating Pirate Treasure QR Codes...');
  try {
    for (let t = 1; t <= teams; t++) {
      const teamId = `Team${t}`;
      
      // Start QR
      const startStr = `${teamId}_start`;
      await QRCode.toFile(path.join(outDir, `${startStr}.png`), startStr, {
        width: 300,
        margin: 2,
        color: {
          dark: '#451A03',  // Dark amber/brown pirate color
          light: '#FEF3C7' // Light amber parchment color
        }
      });

      for (let c = 1; c <= cluesPerTeam; c++) {
        const clueStr = `${teamId}_clue_${c}`;
        await QRCode.toFile(path.join(outDir, `${clueStr}.png`), clueStr, {
          width: 300,
          margin: 2,
          color: {
            dark: '#451A03',
            light: '#FEF3C7'
          }
        });
      }
    }
    console.log(`Successfully generated 70 physical QR codes in '${outDir}'!`);
  } catch (error) {
    console.error('Error generating QR codes:', error);
  }
}

run();
