export class MeasurementNotFoundError extends Error {
     constructor(){
          super("Medição não encontrada!")
          Object.setPrototypeOf(this, MeasurementNotFoundError.prototype);
     }
}


