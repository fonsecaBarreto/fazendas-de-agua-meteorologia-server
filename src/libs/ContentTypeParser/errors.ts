import { ExtensionBoundSchema, object } from "joi";
import { IContentTypeHandler } from "./protocols";

export class InvalidContentTypeError extends Error {
     constructor(){
          super("Nenhum Conteudo encontrado.")
          Object.setPrototypeOf(this, InvalidContentTypeError.prototype);
     }
}

export class FileError extends Error {

     params: IContentTypeHandler.Conflicts
     constructor(params: IContentTypeHandler.Conflicts){
          super("Existem Pendencias nos arquivos exigidos para essa operação")
          this.params = params
          Object.setPrototypeOf(this, FileError.prototype);
     }
} 
