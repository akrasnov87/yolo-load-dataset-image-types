import { mkdirSync, existsSync, writeFileSync } from "fs"
import { join } from "path"
import axios from "axios";
import { createWriteStream } from "fs";

export const saveDataset = async function(records, outputDir) {
    if(!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive:true });
    }
    
    let partSize = 100;

    for(let i = 0; i < records.length; i++) {
        let record = records[i];
        await downloadImage(record.c_url, join(outputDir, record.id + '.jpg'));
        writeFileSync(join(outputDir, record.id + '.json'), JSON.stringify(record, null, '\t'));

        if(i % partSize) {
            let it = (i * 100) / records.length;
            console.log(`${it}%`);
        }
    }
}

/**
 * Загрузка изображений
 * 
 * @param {string} url ссылка к изображению
 * @param {string} outputPath 
 * @returns 
 */
async function downloadImage (url, outputPath) {  
    const writer = createWriteStream(outputPath)
  
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
  
    response.data.pipe(writer)
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }