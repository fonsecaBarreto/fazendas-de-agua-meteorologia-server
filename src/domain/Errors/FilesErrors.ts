export class FileNotFoundError extends Error {
     constructor(){
          super("Arquivo não encontrado.")
          Object.setPrototypeOf(this, FileNotFoundError.prototype);
     }
}