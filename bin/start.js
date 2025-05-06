import { config } from 'dotenv';
config();
import { join } from 'path';
import { dirname } from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { loadImageTypes, saveDataset } from '../modules/image-types/index.js'

const OUTPUT_DATA_DIR = join(__dirname, '../', 'data');
const items = process.env.OUTPUT_SAVE_TYPE ? [process.env.OUTPUT_SAVE_TYPE + '.csv'] : readdirSync(OUTPUT_DATA_DIR);
const OUTPUT_SAVE_TYPES_DIR = join(__dirname, '../', process.env.OUTPUT_DATSETS, 'types');

for(let i = 0; i < items.length; i++) {
    let records = await loadImageTypes(OUTPUT_DATA_DIR, items[i]);
    let item = items[i].replace('.csv', '');

    const OUTPUT_SAVE_LIMIT = process.env.OUTPUT_SAVE_LIMIT || records.length;

    await saveDataset(records.slice(0, OUTPUT_SAVE_LIMIT), join(OUTPUT_SAVE_TYPES_DIR, item));
}