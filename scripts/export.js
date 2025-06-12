import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '..', 'data', 'repAllDATA.json');
const outputDir = path.join(__dirname, '..', 'output');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const json = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// List of reward types to export
const rewardTypes = ['hnt', 'iot'];

for (const type of rewardTypes) {
    const history = json?.data?.[0]?.rewards?.[type]?.history;

    if (!Array.isArray(history)) {
        console.error(`❌  Invalid JSON structure: 'data[0].rewards.${type}.history' not found.`);
        continue;
    }

    const csvPath = path.join(outputDir, `${type}_rewards.csv`);
    const csvLines = ['timestamp,amount'];

    for (const { date, amount } of history) {
        csvLines.push(`${date},${amount}`);
    }

    fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');
    console.log(`✅  CSV written to: ${csvPath}`);
}
