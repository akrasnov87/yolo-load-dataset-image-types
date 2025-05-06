import { join } from 'path';
import { createReadStream } from 'fs';
import csvReadableStream from 'csv-reader';

export const loadImageTypes = async function(dataPath, fileName) {
    let inputStream = createReadStream(join(dataPath, fileName), 'utf8');
    let records = [];
    return new Promise(function(resolve, reject) {
        inputStream
                .pipe(new csvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true, asObject: true }))
                .on('data', function (row) {
                    records.push(row);
                })
                .on('end', function () {
                    resolve(records);
                });
    });
}