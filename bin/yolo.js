import { config } from 'dotenv';
config();
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { convertData2YoloCls } from '../modules/yolo/index.js'

const INPUT_FOR_YOLO_DATA = join(__dirname, '../', process.env.INPUT_FOR_YOLO_DATA);
const OUTPUT_YOLO = join(__dirname, '../', process.env.OUTPUT_YOLO);

await convertData2YoloCls(INPUT_FOR_YOLO_DATA, OUTPUT_YOLO);
console.log('Convert finished');