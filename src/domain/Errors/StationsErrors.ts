export class StationNotFoundError extends Error {
     constructor(){
          super("Estação nao encontrada.")
          Object.setPrototypeOf(this, StationNotFoundError.prototype);
     }
}
