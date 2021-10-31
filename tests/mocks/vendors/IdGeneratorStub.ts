import { IIdGenerator } from "../../../src/domain/Interfaces";

export class IdGeneratorStub implements IIdGenerator {
     gen(): string {
          return "generated_id"
     }
}