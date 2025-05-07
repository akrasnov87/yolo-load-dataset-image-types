import { join } from 'path';
import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'fs';
import sharp from 'sharp';
import { config } from 'dotenv';
config();

export const convertData2YoloCls = async function(inputDir, outputDir) {
    return new Promise(async function(resolve, reject) {
        if(!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true }); 
        } else {
            //reject(new Error('Выходной каталог уже присутствует!'));
        }

        const items = readdirSync(inputDir);
        let records = {};

        for(let i = 0; i < items.length; i++) {
            let item = items[i];

            const files = readdirSync(join(inputDir, item));

            records[item] = [];
            let idx = 0;
            for(let j = 0; j < files.length; j ++) {
                let file = files[j];

                if(file.indexOf('.jpg') > 0) {
                    records[item].push({
                        idx: idx,
                        name: `${idx}_${item}.jpg`,
                        path: join(inputDir, item, file)
                    })

                    idx++;
                }
            }
        }

        const dirs = [{name: 'train', start: 0, end: 5000}, { name: 'test', start: 5000, end: 7500 }, { name: 'val', start: 7500, end: 10000}];
        for(let i = 0; i < dirs.length; i++) {
            let dir = dirs[i];

            console.log(`creating ${dir.name}...`);

            mkdirSync(join(outputDir, dir.name), { recursive: true }); 
            for(let j = 0; j < items.length; j++) {
                let item = items[j];
                console.log(`creating ${dir.name}\\${item}...`);

                mkdirSync(join(outputDir, dir.name, item), { recursive: true }); 

                let _records = records[item].slice(dir.start, dir.end);

                for(let k = 0; k < _records.length; k++) {
                    let _item = _records[k];
                    const destPath = join(outputDir, dir.name, item, _item.name);
                    //copyFileSync(_item.path, destPath);
                    try {
                        await sharp(_item.path).resize(parseInt(process.env.IMAGE_RESIZE || 64)).toFile(destPath);
                    }catch(err) {
                        console.error(err);
                    }
                }
            }
        }

        resolve();
    });
}