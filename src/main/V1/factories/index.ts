import { BaseController } from '../../../presentation/Protocols/BaseController'
import { SchemaValidator } from '../../../libs/ApplicatonSchema/SchemaValidator'

const validator = new SchemaValidator

BaseController._validator = validator