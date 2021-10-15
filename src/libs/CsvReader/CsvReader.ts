import * as csv from 'fast-csv';
import { Readable } from "stream"
import { InvalidCsvFile } from './errors';

import { CsvReader } from './interfaces'

export default class AppCsvReader implements CsvReader {
     config: CsvReader.Config;
     constructor(c?:Partial<CsvReader.Config>){

          this.config = {
               separator: ",",
               quote: '"',
               headers: [],
               ...c
          }
     }

     read(buffer: Buffer): Promise<any[]>{
          const { separator, quote, headers } = this.config
          const results: any = []
          const readable = new Readable()
          return new Promise( (resolve, reject) => {
               readable.push(buffer);
               readable.push(null);
               readable
               .pipe(csv.parse({ 
                    headers: headers.length > 0 ? headers : true,
                    skipLines: headers.length > 0 ? 1 : 0,
                    delimiter: separator, quote,
                    trim: true
               }))
               .on('error', error => reject( new InvalidCsvFile(error)))
               .on('data', row => results.push(row))
               .on('end', (rowCount: number) => { return resolve(results) })
          });
     }
}

     