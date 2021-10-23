export class MeasurementNotFoundError extends Error {
     constructor(){
          super("Medição não encontrada!")
          Object.setPrototypeOf(this, MeasurementNotFoundError.prototype);
     }
}


export class MeasurementsDuplicatedError extends Error {
     constructor(){
          super("Já existe uma medição com mesma data para essa estação")
          Object.setPrototypeOf(this, MeasurementsDuplicatedError.prototype);
     }
}


