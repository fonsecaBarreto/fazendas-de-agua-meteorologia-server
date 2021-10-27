import { FileError, IContentTypeHandler, InvalidContentTypeError } from "./protocols";
export * from './protocols'

import { Request as ExpressRequest, Response as ExpressResponse, response } from 'express'
import Formidable from 'formidable'
import { convertTypeAcquisitionFromJson } from "typescript";

export const MakeInvalidFileMessage = ( types:string[], limit: number ) => {
     const list = types.map(t=>(` .${t.substring(t.lastIndexOf("/")+1, t.length )}`)) 
     const limitMb = (limit / (1024 * 1024 )).toFixed(2);
     const message = `Somente arquivos (${ list} ) com tamanho maximo de ${limitMb} Mb.`
     return message
}

export const MakeMissingFileMessage = ( key:string ) => {
     return `Não foi encontrado um arquivo válido `
}

export const MakeFileLengthExceed = (n: number) => {
     return `Não é permitido mais que ${n} Arquivo${n > 1 ? 's' : ''}`
}


export class FormDataParser implements IContentTypeHandler {
     
     constructor( private readonly fileSchema: IContentTypeHandler.Schema ){ }

     execute(request: ExpressRequest): Promise<void> {

          const formidable = new Formidable.IncomingForm({ multiples: true });
          const conflicts: IContentTypeHandler.Conflicts = {};
          const files: IContentTypeHandler.Result = {}

          return new Promise( async (resolve, reject) => {

               if(!request.is('multipart/form-data')) return reject(new InvalidContentTypeError())
               
               formidable.parse(request, async (err: Error, fields:any) => {
                    if(err) return reject(err)

                    this.validateMissingParams(files, conflicts);

                    if(Object.keys(conflicts).length > 0 ) return reject(new FileError(conflicts))
     
                    request.body = { ...fields }
                    request.files = files

                    return resolve()
               });

               const fieldNames = Object.keys(this.fileSchema);
               var partCount: any = {}

               formidable.onPart = (part:any) => {

                    if (!part.filename || !part.mime ) { formidable.handlePart(part); } // all non-files will pass

                    if (part.mime && fieldNames.includes(part.name)) { // Handle files

                         files[part.name] = files[part.name] || [];
                         partCount[part.name]  = partCount[part.name] ? partCount[part.name] + 1 : 1

                         const specs = this.fileSchema[part.name];
                         const { max_size, types, multiples } = specs 

                         if(partCount[part.name] > multiples ){
                              conflicts[part.name] = { message: MakeFileLengthExceed( multiples ), fileName: part.filename, specs }
                              return reject(new FileError(conflicts))
                         }
                       
                         if(!types.includes(part.mime)) { 
                              conflicts[part.name] = { message: MakeInvalidFileMessage( types, max_size ), fileName: part.filename, specs   }
                         }
     
                         var bufferList:any =[]
                         var totalSize = 0
                         var form: IContentTypeHandler.FormDataFile = { buffer: null, contentType: part.mime, size: 0, fileName: part.filename }
                    
                         part.on('data', (buffer: Buffer) => {
                              bufferList.push(buffer);
                              totalSize += buffer.length;
                              if(totalSize > max_size) {
                                   conflicts[part.name] = { message: MakeInvalidFileMessage( types, max_size ), fileName: part.fileName, specs }
                              }
                         });
                         
                         part.on('end', (data:any) =>{
                              form.buffer = Buffer.concat(bufferList);
                              form.size = form.buffer.length;
                              files[part.name] = files[part.name].length ? [ ...files[part.name], form ] : [ form ] 
                         })
                    }
               };
          }) 
    }

    validateMissingParams( files: IContentTypeHandler.Result, conflicts: IContentTypeHandler.Conflicts ){
          Object.keys(this.fileSchema).map( key => {
               const specs = this.fileSchema[key]
               if( !Object.keys(files).includes(key) && specs.optional !== true  ){
                    conflicts[key] = { message: MakeMissingFileMessage(key), fileName: "", specs }
               }
          }) 
     }

}


