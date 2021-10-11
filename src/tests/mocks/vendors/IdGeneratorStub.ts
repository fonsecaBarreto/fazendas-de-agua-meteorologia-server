import { IIdGenerator } from "../../../domain/Interfaces";

export class IdGeneratorStub implements IIdGenerator {
     gen(): string {
          return "generated_id"
     }
}